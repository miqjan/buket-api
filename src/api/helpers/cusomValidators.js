import UserModel from '../modules/user/userModel';
import { ValidationError } from '../../config/errors';
export const validPassword =  async  (current_password,user_id) => {
    try {
        if (!await UserModel.prototype.validPassword(user_id,current_password)) {
            throw new ValidationError('Incorect current password');
        }
    } catch (error) {
        throw error;
    }
};
