import { injectable } from 'inversify';
import { Command, command } from '../../index';
import { AdminService } from '../services/admin';

export class AdminCommandParams {
}

@command('admin', AdminCommandParams)
@injectable()
export class AdminCommand implements Command<AdminCommandParams> {
  constructor(private admin: AdminService) {
  }

  execute() {
    this.admin.someAdminFunction();
  }
}
