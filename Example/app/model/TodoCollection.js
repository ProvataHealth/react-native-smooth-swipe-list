import Immutable from 'immutable';
import Todo from './Todo';
import find from 'lodash';
import findIndex from 'lodash';
import filter from 'lodash';

class TodoCollection {

    constructor(items = []) {
        if (items instanceof Immutable.Collection) {
            this.items = Immutable.List(items);
        }
        else {
            this.items = new Immutable.fromJS(items.map(this._wrapItemWithTodo));
        }
        this.length = this.items.size;
        for (let i = 0; i < this.length; i++) {
            this[i] = this.items.get(i);
        }
    }

    get(index) {
        return this.items.get(index);
    }

    getById(id) {
        return find(this.items, item => item.get() === id);
    }

    putById(id, item) {
        if (!item) {
            return this;
        }
        let index = findIndex(this.items, (item) => {
            return item.getId() === id;
        });
        item = (item instanceof Immutable.Map) ? item : this._wrapItemWithTodo(item);
        return new TodoCollection(index ? this.items.set(index, item) : this.push(item));
    }

    set(index, item) {
        if (!item) {
            return this;
        }
        if (item instanceof Immutable.Map) {
            return new TodoCollection(this.items.set(index, item));
        }
        return new TodoCollection(this.items.set(index, this._wrapItemWithTodo(item)));
    }

    filterComplete() {
        let items = filter(this.items,(item) => item.complete) || [];
        return new TodoCollection(items);
    }

    filterIncomplete() {
        let items = filter(this.items,(item) => !item.complete) || [];
        return new TodoCollection(items);
    }

    filterArchived() {
        let items = filter(this.items,(item) => item.archived) || [];
        return new TodoCollection(items);
    }

    filterBy(predicate) {
        let items = filter(this.items, predicate);
        if (items) {
            new TodoCollection(items);
        }
        return this;
    }

    delete(index) {
        return this.deleteBy((item, i) => {
            return i === index;
        });
    }

    deleteBy(predicate) {
        let index = findIndex(this.items, predicate);
        if (index) {
            return new TodoCollection(this.items.delete(index));
        }

        return this;
    }

    pop() {
        return new TodoCollection(this.items.pop());
    }

    push(item) {
        if (!item) {
            return this;
        }
        if (item instanceof Immutable.Map) {
            return new TodoCollection(this.items.push(item));
        }
        return new TodoCollection(this.items.push(this._wrapItemWithTodo(item)));
    }

    _wrapItemWithTodo(item) {
        return new Todo(item);
    }

}


export default TodoCollection;