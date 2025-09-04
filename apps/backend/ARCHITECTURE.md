# Architecture Documentation

This document describes the complete architecture of the Expense Manager Backend, including the Repository pattern implementation and AWS infrastructure.

## 🏗️ Application Architecture Overview

The application follows a layered architecture with clear separation of concerns:

## ☁️ AWS Infrastructure Architecture

The application is deployed on AWS using Infrastructure as Code (Pulumi):

## 🔧 Repository Pattern Benefits

### 1. **Separation of Concerns**

- **Services**: Handle business logic and orchestration
- **Repositories**: Handle data access and persistence
- **Controllers**: Handle HTTP concerns

### 2. **Testability**

- Easy to mock repositories for unit testing
- Services can be tested independently of database
- Integration tests can use real repositories

### 3. **Maintainability**

- Centralized data access logic
- Easy to change database implementation
- Consistent error handling across repositories

### 4. **Reusability**

- Repository methods can be reused across services
- Common operations abstracted in base repository

## 📁 Repository Structure

### Base Repository

```typescript
// src/common/repositories/base.repository.ts
export abstract class BaseRepository<TEntity> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected handleError(error: unknown, action: string): never {
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as BaseRepositoryError;

      if (prismaError.code === 'P2002') {
        throw new Error(`${this.modelName} already exists`);
      }

      if (prismaError.code === 'P2025') {
        throw new Error(`${this.modelName} not found`);
      }
    }

    throw new Error(
      `Error ${action} ${this.modelName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
```

### Specific Repositories

- **IncomeRepository**: Handles income data operations
- **CategoryRepository**: Handles category data operations with expense counting
- **ExpenseRepository**: Handles expense data operations with category relations

## 🔄 Data Flow

### 1. **Request Flow**

### 2. **Response Flow**

### 3. **Error Handling Flow**

## 📝 Repository Methods

### Common CRUD Operations

All repositories implement common CRUD operations:

```typescript
// Standard operations available in all repositories
create(data: CreateDto): Promise<Entity>
findAll(): Promise<Entity[]>
findOne(id: string): Promise<Entity | null>
update(id: string, data: UpdateDto): Promise<Entity>
delete(id: string): Promise<Entity>
```

### Custom Methods

Repositories implement custom methods for specific business needs:

```typescript
// CategoryRepository
async findWithExpenseCount(id: string): Promise<CategoryWithCount | null>

// ExpenseRepository
// (No additional custom methods currently)

// IncomeRepository
// (No additional custom methods currently)
```

## 🏗️ Infrastructure as Code (Pulumi)

### Infrastructure Modules

The AWS infrastructure is organized into modular components:

#### Networking Module (`modules/networking/`)

- **VPC**: Virtual Private Cloud with DNS support
- **Subnets**: Public and private subnets across AZs
- **Internet Gateway**: Internet access for public subnets
- **NAT Gateway**: Outbound internet for private subnets
- **Route Tables**: Traffic routing configuration

#### Database Module (`modules/database/`)

- **RDS PostgreSQL**: Managed database instance
- **Security Groups**: Database access control
- **Subnet Groups**: Database placement in private subnets

#### Compute Module (`modules/compute/`)

- **ECS Cluster**: Container orchestration
- **Fargate Tasks**: Serverless container execution
- **Task Definitions**: Container specifications
- **IAM Roles**: Service permissions
- **Security Groups**: Application access control

#### Deployment Module (`modules/deployment/`)

- **ECR Repository**: Container image storage
- **Application Load Balancer**: Traffic distribution
- **Target Groups**: Health check configuration
- **Docker Build**: Automated image building

#### Monitoring Module (`modules/monitoring/`)

- **CloudWatch Logs**: Centralized logging
- **CloudWatch Dashboard**: Infrastructure monitoring

### Infrastructure Configuration

```typescript
// infra/configs/infrastructure.ts
export const config = new pulumi.Config();

// Database settings
export const dbInstanceClass = 'db.t3.micro';
export const dbAllocatedStorage = 20;
export const dbPassword = config.requireSecret('dbPassword');

// Application settings
export const appPort = 3000;
export const appHealthCheckPath = '/health';

// Network settings
export const vpcCidr = '10.0.0.0/16';
export const publicSubnetCidrs = ['10.0.1.0/24', '10.0.2.0/24'];
export const privateSubnetCidrs = ['10.0.3.0/24', '10.0.4.0/24'];
```

### Deployment Flow

### Security Considerations

- **Network Isolation**: Database in private subnets only
- **Security Groups**: Principle of least privilege
- **Encryption**: RDS encryption at rest
- **Secrets**: Managed via Pulumi secrets
- **IAM Roles**: Service-specific permissions

## 🧪 Testing Strategy

### Unit Testing

- **Services**: Mock repositories to test business logic
- **Controllers**: Mock services to test HTTP handling
- **Repositories**: Mock Prisma to test data access logic

### Integration Testing

- Use real repositories with test database
- Test complete data flow from controller to database

### Example Service Test

```typescript
describe('IncomesService', () => {
  let service: IncomesService;
  let mockRepository: jest.Mocked<IncomeRepository>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        IncomesService,
        { provide: IncomeRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<IncomesService>(IncomesService);
    mockRepository = module.get(IncomeRepository);
  });

  it('should create income', async () => {
    const dto = { amount: 100, description: 'Salary' };
    const expected = { id: '1', ...dto, date: new Date() };

    mockRepository.create.mockResolvedValue(expected);

    const result = await service.create(dto);
    expect(result).toEqual(expected);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });
});
```

## 🔒 Error Handling

### Repository Level

- **Prisma Errors**: Converted to domain-specific errors
- **Validation Errors**: Handled before reaching repository
- **Connection Errors**: Propagated with context

### Service Level

- **Business Logic Errors**: Thrown with meaningful messages
- **Validation Errors**: Converted to appropriate HTTP status codes
- **Repository Errors**: Wrapped with business context

### Controller Level

- **HTTP Status Codes**: Mapped from service errors
- **Error Responses**: Consistent format across all endpoints

## 🚀 Future Enhancements

### 1. **Caching Layer**

```typescript
@Injectable()
export class CachedIncomeRepository implements IRepository<Income> {
  constructor(
    private readonly repository: IncomeRepository,
    private readonly cache: CacheService,
  ) {}
}
```

### 2. **Event Publishing**

```typescript
@Injectable()
export class EventPublishingIncomeRepository implements IRepository<Income> {
  async create(data: CreateIncomeDto): Promise<Income> {
    const income = await this.repository.create(data);
    await this.eventBus.publish(new IncomeCreatedEvent(income));
    return income;
  }
}
```

### 3. **Audit Logging**

```typescript
@Injectable()
export class AuditedIncomeRepository implements IRepository<Income> {
  async update(id: string, data: UpdateIncomeDto): Promise<Income> {
    const oldIncome = await this.repository.findOne(id);
    const updatedIncome = await this.repository.update(id, data);
    await this.auditService.log('INCOME_UPDATED', {
      oldIncome,
      newIncome: updatedIncome,
    });
    return updatedIncome;
  }
}
```

## 📚 Best Practices

### 1. **Repository Design**

- Keep repositories focused on single entity
- Use composition over inheritance for complex queries
- Implement custom methods for business-specific queries

### 2. **Service Design**

- Services should not contain data access logic
- Use repositories for all data operations
- Handle business rules and validation

### 3. **Error Handling**

- Use consistent error types across layers
- Log errors with appropriate context
- Return user-friendly error messages

### 4. **Performance**

- Use repository methods for complex queries
- Implement pagination for large datasets
- Consider caching for frequently accessed data

## 🔍 Code Examples

### Repository Implementation

```typescript
@Injectable()
export class IncomeRepository extends BaseRepository<IncomeType> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Income');
  }

  async create(data: CreateIncomeDto): Promise<IncomeType> {
    try {
      return await this.prisma.income.create({
        data,
      });
    } catch (error) {
      this.handleError(error, 'creating');
    }
  }

  async findAll(): Promise<IncomeType[]> {
    try {
      return await this.prisma.income.findMany();
    } catch (error) {
      this.handleError(error, 'finding all');
    }
  }

  async findOne(id: string): Promise<IncomeType | null> {
    try {
      return await this.prisma.income.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'finding');
    }
  }

  async update(id: string, data: UpdateIncomeDto): Promise<IncomeType> {
    try {
      return await this.prisma.income.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleError(error, 'updating');
    }
  }

  async delete(id: string): Promise<IncomeType> {
    try {
      return await this.prisma.income.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'deleting');
    }
  }
}
```

### Service Implementation

```typescript
@Injectable()
export class IncomesService {
  constructor(private readonly _incomeRepository: IncomeRepository) {}

  create(createIncomeDto: CreateIncomeDto): Promise<IncomeType> {
    return this._incomeRepository.create(createIncomeDto);
  }

  findAll(): Promise<IncomeType[]> {
    return this._incomeRepository.findAll();
  }

  findOne(id: string): Promise<IncomeType | null> {
    return this._incomeRepository.findOne(id);
  }

  update(id: string, updateIncomeDto: UpdateIncomeDto): Promise<IncomeType> {
    return this._incomeRepository.update(id, updateIncomeDto);
  }

  remove(id: string): Promise<IncomeType> {
    return this._incomeRepository.delete(id);
  }
}
```

### Controller Implementation

```typescript
@Controller('incomes')
export class IncomesController {
  constructor(private readonly _incomesService: IncomesService) {}

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto): Promise<IncomeType> {
    return this._incomesService.create(createIncomeDto);
  }

  @Get()
  findAll(): Promise<IncomeType[]> {
    return this._incomesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IncomeType | null> {
    return this._incomesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ): Promise<IncomeType> {
    return this._incomesService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IncomeType> {
    return this._incomesService.remove(id);
  }
}
```

## 🎯 Architecture Summary

This architecture provides a comprehensive solution that combines:

### Application Architecture

- **Clean separation of concerns** with Repository pattern
- **Scalable and maintainable** NestJS application structure
- **Type-safe database operations** with Prisma ORM
- **Comprehensive error handling** across all layers
- **Testable components** with dependency injection

### Infrastructure Architecture

- **Cloud-native deployment** on AWS with ECS Fargate
- **Infrastructure as Code** with Pulumi for reproducible deployments
- **Secure networking** with VPC, private subnets, and security groups
- **Managed database** with RDS PostgreSQL
- **Monitoring and observability** with CloudWatch
- **Automated CI/CD** with containerization and rolling deployments

This foundation enables building **scalable, maintainable, and testable** applications while following **SOLID principles** and **clean architecture patterns**, with the added benefit of **production-ready cloud infrastructure** that can scale with business needs.
