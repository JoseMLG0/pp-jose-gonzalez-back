import users from './schema';

export default class OperationsUser {
    public async createUser(userData: any) {
        const newUser = new users(userData);
        return await newUser.save();
    }
    public async filterUser(query: any) {
        return await users.findOne(query);
    }
    public async filterUsers(query: any) {
        return await users.find(query).select({ 'password': 0 });
    }
    public updateUser(userData: any, callback: any) {
        const query = { _id: userData._id };
        users.findOneAndUpdate(query, userData, callback);
    }
    public async deleteUser(_id: String) {
        const query = { _id: _id };
        await users.deleteOne(query);
        return true;
    }
}