const DAO  = require("../DAO/query");
const Models = require("../models/index");
const GlobalHelper = require("../helper/helper");
const { ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD } = process.env;

class BootstrapHelper {

    static createAdmin = async () => {
        try {
            const query = { email: ADMIN_DEFAULT_EMAIL };
            const projection = { __v: 0 };
            const options = { lean: true };
            const admin = await DAO.getData(Models.Users, query, projection, options);
            
            if (!admin.length) {
                const password = await GlobalHelper.bcryptPassword(ADMIN_DEFAULT_PASSWORD);
                const dataToSave = {
                    name: "super admin",
                    email: ADMIN_DEFAULT_EMAIL,
                    password: password,
                    roles: "ADMIN",
                    email_verified: true,
                    created_at: Date.now()
                };
                
                await DAO.saveData(Models.Users, dataToSave);
            }
        } catch (err) {
            throw err;
        }
    };

    static bootstrapData = async () => {
        try {
            await this.createAdmin();
        } catch (err) {
            throw err;
        }
    };
}

module.exports = BootstrapHelper;
