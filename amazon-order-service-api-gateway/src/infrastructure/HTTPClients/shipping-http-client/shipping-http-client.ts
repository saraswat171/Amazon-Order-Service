import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ShippingHTTPClient {
  async save(payload: any) {
    return await axios.post(process.env.SHIPPING_SERVICE_URL, payload);
  }
}
