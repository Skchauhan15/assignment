const AWS = require("aws-sdk");
const User = require("../../models/user_model");
const DAO = require("../../DAO/query");
const moment = require("moment");
const { handleSuccess, handleCatch } = require("../../helper/helper");
const { saveData } = require("../../DAO/query");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
require("dotenv").config();

let do_spaces_key = process.env.DO_ACCESS_KEY;
let do_spaces_secret = process.env.DO_SECRET_ACCESS_KEY;
let do_spaces_bucket_name = process.env.BUCKET_NAME;
let do_region = process.env.DO_REGION;
let do_spaces_endpoint = process.env.DO_ENDPOINT;
let base_url = process.env.URL;

const spaceEndpoint = new AWS.Endpoint(do_spaces_endpoint);
const s3 = new AWS.S3({
  endpoint: spaceEndpoint,
  accessKeyId: do_spaces_key,
  secretAccessKey: do_spaces_secret,
});

const uploadFiles = async (req, res) => {
  try {
    let {
      file: { name, data, mimetype },
    } = req.files;
    let { user_id } = req.user_data;
    // console.log(req.file);
    // console.log(req.user_data);

    let split_mime_type = mimetype.split("/");
    console.log(split_mime_type);

    if (split_mime_type[0] == "image") {
      let response = await upload_images(name, data, mimetype);
      // console.log(response);

      await save_to_User(user_id, response.location);
      response.user_id = user_id;
      handleSuccess(res, response);
    } else if (split_mime_type[0] == "audio") {
      let response = await upload_audio(name, data, mimetype);

      handleSuccess(res, response);
    } else if (split_mime_type[0] == "video") {
      let response = await upload_video(name, data, mimetype);
      handleSuccess(res, response);
    } else if ((split_mime_type[0] = "pdf")) {
      let response = await upload_doc(name, data, mimetype);
      handleSuccess(res, response);
    } else {
      let message = " sorry we can't suppor this media ";
      handleCatch(res, message);
    }
  } catch (error) {
    handleCatch(res, error);
    console.log("error here in try catch");
  }
};

const upload_images = async (name, data, mime_type) => {
  try {
    let file_name = await generate_file_name(name);
    let params = {
      Bucket: do_spaces_bucket_name,
      Key: `shared2/image/${file_name}`,
      ACL: "public-read",
      Body: data,
      ContentType: mime_type,
    };

    let uploaded_data = await upload_file_to_spaces(params);

    let response = {
      base_url: base_url,
      type: "IMAGE",
      folder: ["IMAGE"],
      location: uploaded_data.Location,
    };

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const upload_audio = async (name, data, mime_type) => {
  try {
    let file_name = await generate_file_name(name);
    let params = {
      Bucket: do_spaces_bucket_name,
      Key: `shared2/audio/${file_name}`,
      ACL: "public-read",
      Body: data,
      ContentType: mime_type,
    };
    await upload_file_to_spaces(params);

    let response = {
      base_url: base_url,
      type: "AUDIO",
      folders: ["audio"],
      file_name: file_name,
      location: uploaded_data.location,
    };
    return response;
  } catch (error) {
    throw error;
  }
};

const upload_video = async (name, data, mime_type) => {
  try {
    let file_name = await generate_file_name(name);
    let params = {
      Bucket: do_spaces_bucket_name,
      Key: `shared2/video/${file_name}`,
      ACL: "public-read",
      Body: data,
      ContentType: mime_type,
    };
    await upload_file_to_spaces(params);

    let response = {
      base_url: base_url,
      type: "VIDEO",
      folders: ["video"],
      file_name: file_name,
      location: uploaded_data.Location,
    };
    return response;
  } catch (error) {
    throw error;
  }
};

const upload_doc = async (name, data, mime_type) => {
  try {
    //  let file_name = await generate_file_name(name)
    let params = {
      Bucket: do_spaces_bucket_name,
      Key: `shared2/documents/${name}`,
      ACL: "public-read",
      Body: data,
      ContentType: mime_type,
    };

    await upload_file_to_spaces(params);

    let response = {
      base_url: base_url,
      type: "DOCUMENT",
      folders: ["documents"],
      file_name: file_name,
      location: uploaded_data.location,
    };
    return response;
  } catch (error) {
    throw error;
  }
};
const upload_file_to_spaces = (params) => {
  console.log("in uploading phase");
  return new Promise((resolve, reject) => {
    try {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log("uploading error", err);
        } else {
          console.log("uploading successfull", data);
          return resolve(data);
        }
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const listFiles = () => {
  return new Promise((resolve, reject) => {
    try {
      let params = { Bucket: do_spaces_bucket_name };
      s3.listObjects(params, (err, data) => {
        if (err) {
          console.log("error", err);
          throw err;
        } else {
          return resolve(data);
        }
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const save_to_User = async (user_id, location) => {
  try {
    let query = { _id: user_id };
    let to_update = { $push: { uploaded_items: { itemlink: location } } };
    let fetchUser = await DAO.findAndUpdate(User, query, to_update);
    return fetchUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const generate_file_name = async (file_name) => {
  try {
    // console.log("<--file_name-->", file_name)

    let current_millis = moment().format("x");
    let raw_file_name = file_name.split(/\s/).join(""); //white space search
    let split_file = raw_file_name.split(".");

    // spiting by all special charcters
    let split_all = split_file[0].split(/[^a-zA-Z0-9]/g).join("_");

    let name = split_all.toLowerCase();
    let ext = split_file[1];

    // console.log("<--name-->", name)
    // console.log("<--ext-->", ext)

    let gen_file_name = `${name}_${current_millis}.${ext}`;

    // console.log("<--gen_file_name-->", gen_file_name)

    return gen_file_name.toLowerCase();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  uploadFiles,
  listFiles,
};
