const saveData = async (Model, data) => {
  try {
    const savedData = await Model.create(data);
    return savedData;
  } catch (error) {
    throw error;
  }
};

const getData = async (Model, query, projection, options) => {
  try {
    const fetchData = await Model.find(query, projection, options);
    return fetchData;
  } catch (error) {
    throw error;
  }
};

const populateData = async (Model, query, projection, options, populateTo) => {
  try {
    const fetchData = await Model.find(query, projection, options).populate(populateTo).exec();
    return fetchData;
  } catch (error) {
    throw error;
  }
};

const findAndUpdate = async (Model, query, update, options) => {
  try {
    const updateData = await Model.findOneAndUpdate(query, update, options);
    return updateData;
  } catch (error) {
    throw error;
  }
};

const removeData = async (Model, query) => {
  try {
    const response = await Model.deleteMany(query);
    return response;
  } catch (error) {
    throw error;
  }
};

const removeOne = async (Model, query) => {
  try {
    const response = await Model.deleteOne(query);
    return response;
  } catch (error) {
    throw error;
  }
};

const updateMany = async (Model, query, update) => {
  try {
    const response = await Model.updateMany(query, update);
    return response;
  } catch (error) {
    throw error;
  }
};

const getSingleData = async (Model, query, projection, options) => {
  try {
    const response = await Model.findOne(query, projection, options);
    return response;
  } catch (error) {
    throw error;
  }
};

const findOneAndDelete = async (Model, query) => {
  try {
    const response = await Model.findOneAndDelete(query);
    return response;
  } catch (error) {
    throw error;
  }
};


const countDocument= async (model, query ) => {
  try {
    let response = await model.countDocuments(query)
    return response;
  } catch (error) {
    return  error
  }
}






module.exports = { getData, getSingleData, countDocument, findAndUpdate, findOneAndDelete, populateData, saveData, removeData, updateMany , removeOne};
