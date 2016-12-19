# react-native-smooth-swipe-list

#### A better swipe-able ListView

## Example
gifs coming soon...
#### Running example
```bash
git clone git@github.com:ProvataHealth/react-native-smooth-swipe-list.git
cd react-native-smooth-swipe-list
cd Example
npm install
react-native run-ios #or react-native run-android
```

## Installation
*note: you must be logged into an npmuser with proper permissions to access @provata*
```bash
npm install --save @provata/react-native-smooth-swipe-list
```

## Usage
```javascript
...
import SwipeList from '@provata/react-native-smooth-swipe-list';

const ListParent = React.createClass({
    
    propTypes: {
        // takes in array of todo objects
        ...
    },
    
    componentDidMount() {
        // it's a good idea to store the derived rowData to prevent 
        // unnecessary re-renders of the rows in the ListView 
        this.rowData = this.props.todos.map(this.constructRowData);
    },
    
    componentWillReceiveProps(nextProps) {
        // however if you store the derived data you will need to handle the 
        // logic for whether a rowData element needs to be replaced
        ...
    },
    
    constructRowData(todo) {
        return {
            key: todo.id,
            rowView: this.getRowView(todo),
            leftSubView: this.getMarkCompleteButton(), //optional
            rightSubView: this.getArchiveButton(), //optional
            style: styles.row //optional but recommended to style your rows
        };
    },
        
    getRowView() {
        // return the view that will be the face of the row
        ...
    },
    
    getMarkCompleteButton() {
        // return your touchable view, it can be whatever 
        ...
    },
    
    getArchiveButton() {
        ...
    }
    
    render() {
        return <SwipeList rowData={this.rowData} />;
    }
});
```

##API
###SwipeList Component
####Props
####SwipeRow Component

## Feature Checklist
- [x] Support left/right sub views of arbitrary size
- [x] Support basic inertia
- [x] Minimize the number of renders / updates
- [ ] Passing left/right button props instead of views for ease of use
- [ ] Multi sub view staggered position translation
- [ ] Passing pan information to sub views (e.g. for animating icons, bg color, etc)
- [ ] Animate add/remove of SwipeRows from SwipeList
- [ ] Improve gesture inertia