import { MapperRegistry } from 'http-problem-details-mapper';
import {
  DtoValidationExceptionMapper,
  // UserEmailAlreadyExistsConflictMapper,
  ValidationPipeExceptionMapper,
} from './mappers';

export class MapperRegistryFactory {
  static create(): MapperRegistry {
    return new MapperRegistry({ useDefaultErrorMapper: false })
      // .registerMapper(new UserEmailAlreadyExistsConflictMapper())
      .registerMapper(new DtoValidationExceptionMapper())
      .registerMapper(new ValidationPipeExceptionMapper());
  }
}