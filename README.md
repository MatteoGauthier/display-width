# display-width

A node.js port of [uwcwidth](https://github.com/Z4JC/uwcwidth), a fast function for determining a string's display width

## How to use it

```js
import { wcswidth } from "display-width";

// wcswidth("👩‍❤️‍👨") == 2
console.log(wcswidth("\u{1F469}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F468}"));
```

## Why to use it

```
>> wcswidth("café") == 4
>> "café".length == 5

>> wcswidth("⚠︎ warning") == 9
>> "⚠︎ warning".length == 10

>> wcswidth("👨‍👨‍👧‍👧") == 2
>> "👨‍👨‍👧‍👧".length == 11

>> wcswidth("👩‍❤️‍👨") == 2
>> "👩‍❤️‍👨".length == 8
```

## Is it fast?

yes! Compared to [string-width](https://www.npmjs.com/package/string-width), it's about **33x** faster

```
┌─────────┬─────────────────┬───────────┬────────────────────┬───────────┬─────────┐
│ (index) │ Task Name       │ ops/sec   │ Average Time (ns)  │ Margin    │ Samples │
├─────────┼─────────────────┼───────────┼────────────────────┼───────────┼─────────┤
│ 0       │ 'display-width' │ '188,426' │ 5307.115321339439  │ '±1.55%'  │ 18843   │
│ 1       │ 'string-width'  │ '5,586'   │ 179008.73345259373 │ '±11.73%' │ 559     │
└─────────┴─────────────────┴───────────┴────────────────────┴───────────┴─────────┘
```

see the [bench directory](https://github.com/llimllib/display-width/tree/main/bench) for details

## Is it large?

no!

## Does it have any dependencies?

no!

## Do you completely understand it?

no! I ported the code and all the tests from
[uwcwidth](https://github.com/Z4JC/uwcwidth) though, so I have good vibes about
it
