import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import config from '../utils/config';
import { sequelize } from '../utils/db';

class Todo extends Model<InferAttributes<Todo>, InferCreationAttributes<Todo>> {
  declare id: CreationOptional<number>;

  declare text: string;

  declare placeNumber: number;

  declare done: boolean;

  declare user: string;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    placeNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    user: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: config.NODE_ENV === 'test' ? 'testtodo' : 'todo',
  }
);

Todo.sync();

export default Todo;
