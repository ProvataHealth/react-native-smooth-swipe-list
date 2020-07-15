# Change log

## v2.0.0
> 2020-07-15
- Resolve a lot of animation bugs introduced in 1.5.0
- Remove scroll view support

## v1.5.0
> 2020-06-11
- Updates React lifecycle usage to avoid using UNSAFE methods.
- Updates to use ES6 formatting.

## v1.4.0
> 2018-02-01

**Breaking changes - requires RN >= 0.47.0**
- Switched from `ListView` to `FlatList`
- `calloutRow` no longer takes a sectionId, it now has the signature `calloutRow(rowNumber, amountToMove)`

## v1.3.0
> 2017-05-23
- Fixed incorrect refs for `ScrollView` type lists. This fixes an issue where the rows would not animate out

## v1.2.5
> 2017-05-19

- Added `calloutRow` to `SwipeList`. `calloutRow` takes a rowId, sectionId, and the amount to open the row and returns a promise.
