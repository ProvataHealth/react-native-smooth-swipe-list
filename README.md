# react-native-smooth-swipe-list

#### A swipe-able ListView component modeled after the list view in the iOS Mail app.

- React Native >= 0.47.0 use 1.4.0

- React Native < 0.47.0 use 1.3.2

## Example
![example gif](https://github.com/ProvataHealth/react-native-smooth-swipe-list/blob/master/Example/assets/capture.gif)

#### Running example
```bash
git clone git@github.com:ProvataHealth/react-native-smooth-swipe-list.git
cd react-native-smooth-swipe-list
cd Example
npm install
react-native run-ios #or react-native run-android
```

## Installation
```bash
npm install --save react-native-smooth-swipe-list
```

## Usage
A `SwipeList` builds a `ListView.DataSource` from its `props.rowData`. The DataSource is primarily the views provided by `rowData` wrapped by a `SwipeRow`
```javascript
...
import SwipeList from 'react-native-smooth-swipe-list';

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
            id: todo.id,
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
    },
    
    render() {
        return <SwipeList rowData={this.rowData} />;
    }
});
```

## API

### SwipeList Component

#### Props
* [FlatList props...](https://facebook.github.io/react-native/docs/flatlist.html)
* `rowData` - Object with the follow properties:
  * `id`(required) - Used to identify the rowData
  * `setRef` - get a reference to the component for this row, receives `component, rowData, index`
  * `rowView`(required) - View to use as the row face
  * `[left/right]SubView` - View to show when swiping left or right
  * `[left/right]leftSubViewOptions` - Options to customize left and right subviews
    * `fullWidth` - Will the view span the full width of the row *(default false)*
    * `closeOnPress` - Whether the row should close on a press if not followed by a valid gesture *(default true)*
  * `style` - Style to apply to the row root view
  * `props` - Any additional props you want to be set on the `SwipeRow`
* `gestureTensionParams` - Provide to tweak the tension of gestures
  * `threshold` - The point at which tension will begin to be applied *(default subViewWidth)*
  * `stretch` - How far past length the gesture can go *(default 1)*
  * `resistanceStrength` The resistance of the gesture past length *(between 0-1, default 0.5)*
* `scrollEnabled` Whether to allow scrolling the ListVIew *(default: true)*
* `onScrollStateChange` - Hook for responding to scroll enabled (true) or disabled (false)
* `swipeRowProps` - Props to be set on all `SwipeRow`'s
* `rowStyle` - Style to apply to all rows root views
* `onSwipeStateChange` - callback for receiving updates about swipe state (SWIPE_START, SWIPE_END, OPEN_ROW_START, OPEN_ROW_END, CLOSE_ROW_START, CLOSE_ROW_END)
* `style` - Style applied to the ListView

### Methods
* `tryCloseOpenRow()` - Close any open row
* `calloutRow(rowNumber, amount):Promise` - Open the row by `amount` and then closes it


### SwipeRow Component
**Note: In most cases you will want to use the `SwipeList` and not directly render a `SwipeRow`**

See [React Native PanResponder](https://facebook.github.io/react-native/docs/panresponder.html) for information about gesture events.

#### Props
* `id` - id of the rows data
* `style` - Style to apply to the row container
* `rowViewStyle` - Style to apply the the inner row view
* `gestureTensionParams` - Provide to tweak the tension of gestures
  * `threshold` - The point at which tension will begin to be applied *(default subViewWidth)*
  * `stretch` - How far past length the gesture can go *(default 1)*
  * `resistanceStrength` The resistance of the gesture past length *(between 0-1, default 0.5)*
* `swipeEnabled` - Where the row should respond to gestures
* `onGestureStart` - Called on initial gesture, before 'onSwipeStart'
* `onSwipeStart` - Called when a gesture starts
* `onSwipeUpdate` - Called each update of the gesture after start and before end 
* `onSwipeEnd` - Called when the gesture ends
* `onOpenStart` - Called when the row open animation begins
* `onOpenEnd` - Called when the row animation ends
* `onCloseStart` - Called when the row close animation begins
* `onCloseEnd` - Called when the row close ends
* `onCapture` - Called when a gesture capture happens
* `[left/right]SubView` - View to be rendered for left / right gestures
* `[left/right]SubViewOptions` - Option for configuring left and right sub views
    * `fullWidth` - Will the view span the full width of the row *(default false)*
    * `closeOnPress` - Whether the row should close on a press if not followed by a valid gesture *(default true)*
* `startOpen` - Whether the row should start open
* `blockChildEventsWhenOpen` - If true will capture gesture events before they reach the rowView *(default: true)*
* `closeOnPropUpdate` - Whether to close the row if new props come in *(default true)*
* `animateRemoveSpeed` - Speed (ms) at which to animate the row when it is removed *(default: 150ms)*
* `animateAddSpeed` - Speed (ms) at which to animate the row when it is removed *(default: 150ms)*

### Methods
* `close(skipAnimation)` - Close row. *Optionally skip animating*
* `open(side, skipAnimation)` - Open row on `side`. *Optionally skip animating*

## Feature Checklist
- [x] Support left/right sub views of arbitrary size
- [x] Support basic inertia
- [x] Minimize the number of renders / updates
- [x] Animate removal of SwipeRows from SwipeList
- [x] Animate adding of SwipeRows to SwipeList
- [ ] Passing left/right button props instead of views for ease of use
- [ ] Multi sub view staggered position translation
- [ ] Passing pan information to sub views (e.g. for animating icons, bg color, etc)
