import Immutable from 'immutable';
import Todo from './Todo';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';

class TodoCollection {

    constructor(items = []) {
        if (items instanceof Immutable.List) {
            this.items = items;
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
        return find(this.items.toArray(), item => item.get() === id);
    }

    putById(id, item) {
        if (!item) {
            return this;
        }
        let index = findIndex(this.items.toArray(), (item) => {
            return item.getId() === id;
        });
        item = (item instanceof Todo) ? item : this._wrapItemWithTodo(item);
        return index >= 0 ? this.set(index, item) : this.push(item);
    }

    set(index, item) {
        if (!item) {
            return this;
        }
        if (item instanceof Todo) {
            return new TodoCollection(this.items.set(index, item));
        }
        return new TodoCollection(this.items.set(index, this._wrapItemWithTodo(item)));
    }

    filterComplete() {
        let items = filter(this.items.toArray(),(item) => item.complete) || [];
        return new TodoCollection(items);
    }

    filterIncomplete() {
        let items = filter(this.items.toArray(),(item) => !item.complete) || [];
        return new TodoCollection(items);
    }

    filterArchived() {
        let items = filter(this.items.toArray(),(item) => item.archived) || [];
        return new TodoCollection(items);
    }

    filterBy(predicate) {
        let items = filter(this.items.toArray(), predicate);
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
        let index = findIndex(this.items.toArray(), predicate);
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
        if (item instanceof Todo) {
            return new TodoCollection(this.items.push(item));
        }
        return new TodoCollection(this.items.push(this._wrapItemWithTodo(item)));
    }

    unshift(item) {
        if (!item) {
            return this;
        }
        if (item instanceof Todo) {
            return new TodoCollection(this.items.unshift(item));
        }
        return new TodoCollection(this.items.unshift(this._wrapItemWithTodo(item)));
    }

    _wrapItemWithTodo(item) {
        return new Todo(item);
    }

}


export default TodoCollection;