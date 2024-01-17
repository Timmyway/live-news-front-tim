import { PouchCollection, PouchORM } from 'pouchorm';
import { IPost } from 'src/interfaces';
PouchORM.LOGGING = true;

export class PostCollection extends PouchCollection<IPost> {
  // Optional. Overide to define collection-specific indexes.
  async beforeInit(): Promise<void> {
    await this.addIndex(['updatedAt']); // be sure to create an index for what you plan to filter by.
  }
}
