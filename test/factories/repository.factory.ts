import { TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

export class RepositoryFactory {

    constructor(private moduleRef: TestingModule) {}

    getRepository<T>(entity: new () => T): Repository<T> {
        return this.moduleRef.get(getRepositoryToken(entity));
    }

    public async cleanUpDatabase() {
        const entityManager = this.moduleRef.get<EntityManager>(EntityManager);

        const promises = [];
        
        for(const entity of entityManager.connection.entityMetadatas) {
            promises.push(entityManager.getRepository(entity.target).clear());
        }

        await Promise.all(promises);
    }
}