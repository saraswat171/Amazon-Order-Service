import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BillingsHTTPClient {
  async save(payload: any) {
    return await axios.post(process.env.BILLING_SERVICE_URL, payload);
  }
}
