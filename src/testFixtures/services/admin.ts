import { injectable } from 'inversify';

@injectable()
export class AdminService {
  someAdminFunction() {
    throw new Error('Not authorised');
  }
}
