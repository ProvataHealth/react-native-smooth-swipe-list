# Change log

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
