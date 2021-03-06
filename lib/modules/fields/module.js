import Module from '../../core/module.js';
// Types.
import './types/boolean.js';
import './types/date.js';
import './types/mongo_object_id.js';
import './types/number.js';
import './types/object.js';
import './types/string.js';
// Utils.
import castNested from './utils/cast_nested.js';
import getAll from './utils/get_all.js';
import getMany from './utils/get_many.js';
import getOne from './utils/get_one.js';
import isNestedFieldName from './utils/is_nested_field_name.js';
import rawAll from './utils/raw_all.js';
import rawMany from './utils/raw_many.js';
import rawOne from './utils/raw_one.js';
import setAll from './utils/set_all.js';
import setDefaults from './utils/set_defaults.js';
import setMany from './utils/set_many.js';
import setOne from './utils/set_one.js';
import traverse from './utils/traverse.js';
// Hooks.
import onInitSchema from './hooks/init_schema.js';
import onInitDefinition from './hooks/init_definition.js';
import onParseDefinition from './hooks/parse_definition.js';
import onMergeDefinitions from './hooks/merge_definitions.js';
import onApplyDefinition from './hooks/apply_definition.js';
import onInitClass from './hooks/init_class.js';

Module.create({
  name: 'fields',
  onInitSchema,
  onInitDefinition,
  onParseDefinition,
  onMergeDefinitions,
  onApplyDefinition,
  onInitClass,
  utils: {
    castNested,
    getAll,
    getMany,
    getOne,
    isNestedFieldName,
    rawAll,
    rawMany,
    rawOne,
    setAll,
    setDefaults,
    setMany,
    setOne,
    traverse
  }
});