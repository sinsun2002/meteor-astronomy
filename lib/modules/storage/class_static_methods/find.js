import _ from 'lodash';
import transformToClass from '../utils/transform_to_class.js';
import Event from '../../events/event.js';
import { Mongo } from 'meteor/mongo';

function createMethod(methodName) {
  return function(selector, options) {
    let Class = this;
    let Collection = Class.getCollection();

    // Get selector from arguments.
    if (arguments.length === 0) {
      selector = {};
    }
    else {
      selector = arguments[0];
    }
    // If selector is null then just proceed to collection's find method.
    if (_.isNull(selector)) {
      return Collection[methodName](selector, options);
    }
    // Rewrite selector to make it an object.
    selector = Mongo.Collection._rewriteSelector(selector);

    // Set default options.
    options = options || {};
    _.defaults(options, {
      defaults: true,
      children: true
    });
    // We don't want to clone raw object in the "find" method.
    options.clone = false;

    // Modify selector and options using the "beforeFind" event handlers.
    if (!options.disableEvents) {
      Class.dispatchEvent(new Event('beforeFind', {
        selector,
        options
      }));
    }

    // If it's an inherited class, then get only documents being instances of
    // the subclass.
    const typeField = Class.getTypeField();
    if (typeField) {
      // If a class has child classes then we have to fetch document being
      // instances of the parent and child classes depending on a value of
      // the "children" option.
      const children = Class.getChildren();
      if (options.children === true && children.length > 0) {
        selector[typeField] = {
          $in: _(children).map(function(Child) {
            return Child.getName();
          }).concat(Class.getName()).value()
        };
      }
      else {
        selector[typeField] = Class.getName();
      }
    }

    // Get custom transform function from the class schema.
    if (options.transform === undefined) {
      options.transform = Class.getTransform(options);
    }
    // Get default transform function if none is provided.
    if (options.transform === undefined) {
      options.transform = transformToClass(Class.getName(), {
        defaults: options.defaults
      });
    }

    // Execute the original method.
    let result = Collection[methodName](selector, options);

    // Modify a query result using the "afterFind" event handlers.
    if (!options.disableEvents) {
      Class.dispatchEvent(new Event('afterFind', {
        selector,
        options,
        result
      }));
    }

    return result;
  };
};

const find = createMethod('find');
const findOne = createMethod('findOne');

export { find, findOne };