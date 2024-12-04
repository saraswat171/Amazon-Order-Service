import { Injectable } from '@nestjs/common';
import { ShippingProduct } from 'src/shipping/domain/product/product.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ShippingProductRepository extends Repository<ShippingProduct> {
    constructor(dataSource: DataSource) {
        super(ShippingProduct, dataSource.createEntityManager());
    }

    async findProduct(product_id: string) {
        return await this.findOne({
            where: { product_id },
        });
    }
}
