import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SalesHTTPClient {
  async save(payload: any) {
    return await axios.post(process.env.SALES_SERVICE_URL, payload);
  }
}
