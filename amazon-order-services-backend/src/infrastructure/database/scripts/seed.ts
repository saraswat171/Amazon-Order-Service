import { dataSource } from 'ormconfig';
import 'reflect-metadata';
import { runSeeders } from 'typeorm-extension';

const run = async () => {
  try {
    await dataSource.initialize();
    await runSeeders(dataSource);
    console.log('Seeders executed successfully');
  } catch (error) {
    console.error('Error executing seeders:', error.message);
  } finally {
    await dataSource.destroy();
  }
};

run().catch((error) => console.error(error));
