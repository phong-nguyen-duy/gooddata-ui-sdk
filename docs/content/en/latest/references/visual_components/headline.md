---
title: Headline
sidebar_label: Headline
copyright: (C) 2007-2018 GoodData Corporation
id: headline_component
---

A **headline** shows a single number or compares two numbers.

Headlines have three sections: Metric (primary) and Metric (secondary) and configuration. You can add one item to the primary metric and up to two items in the secondary metrics. If you add one primary metric and on secondary metric, the headline also displays the comparison of both metrics in percent.

{{< embedded-image alt="Headline" src="/gd-ui/headline.png" >}}

## Structure

```jsx
import { Headline } from "@gooddata/sdk-ui-charts";

<Headline
    primaryMeasure={<measure>}
    secondaryMeasures={[<measures>]}
    config={<chart-config>}
/>
```

## Example

### Headline with a single measure (primary measure)

```jsx
import { Headline } from "@gooddata/sdk-ui-charts";
import * as Md from "./md/full";

<Headline
    primaryMeasure={Md.$FranchiseFees}
/>
```

### Headline with two measures (primary and secondary measure and config for comparison)

```jsx
import { Headline } from "@gooddata/sdk-ui-charts";
import * as Md from "./md/full";

const config = {
    comparison: { 
        enable: true,
        calculationType: "change",
        format: "#,##0%",
        position: "top",
        isArrowEnabled: true,
        labelConfig: {
            isConditional: true,
            positive: "Increase",
            negative: "Decrease",
            eqals: "No change",
        }
    },
};

<Headline
    primaryMeasure={Md.$FranchiseFees}
    secondaryMeasures={[Md.$FranchiseFeesAdRoyalty]}
    config={config}
/>
```

### Headline with Three measures (primary and two secondary measures)
```jsx
import { Headline } from "@gooddata/sdk-ui-charts";
import * as Md from "./md/full";

<Headline
    primaryMeasure={Md.$FranchiseFees}
    secondaryMeasures={[Md.$FranchiseFeesAdRoyalty, Md.$TotalSales]}
/>
```

## Properties

| Name              | Required? | Type               | Description |
|:------------------| :--- |:-------------------| :--- |
| primaryMeasure    | true | IMeasure           | The definition of the primary measure |
| secondaryMeasures | false | IMeasure           | The definition of the secondary measure |
| config            | false | IChartConfig       | The chart configuration object                                                                                                                                                                                                |
| filters           | false | IFilter[]          | An array of filter definitions |
| backend           | false | IAnalyticalBackend | The object with the configuration related to communication with the backend and access to analytical workspaces |
| workspace         | false | string             | The workspace ID |
| locale            | false | string             | The localization of the chart. Defaults to `en-US`.  |
| drillableItems    | false | IDrillableItem[]   | An array of points and attribute values to be drillable |
| ErrorComponent    | false | Component          | A component to be rendered if this component is in error state  |
| LoadingComponent  | false | Component          | A component to be rendered if this component is in loading state  |
| onError           | false | Function           | A callback when the component updates its error state |
| onExportReady     | false | Function           | A callback when the component is ready for exporting its data |
| onLoadingChanged  | false | Function           | A callback when the component updates its loading state |
| onDrill           | false | Function           | A callback when a drill is triggered on the component |

The following example shows the supported `config` structure with sample values. For the descriptions of the individual options, see [ChartConfig](../chart_config/).

```javascript
{
    comparison: {
        enabled: true,
        calculationType: "change",
        colorConfig: {
            disabled: false, 
            positive: {
                type: "guid", 
                value: "positive"
            },
            negative: {
                type: "guid", 
                value: "negative"
            },
            equals: {
                type: "guid",
                value: "equals"
            }
        },
        format: "#,##0%",
        isArrowEnabled: true,
        position: "top",
        labelConfig: {
            unconditionalValue: "Change",
            isConditional: true,
            positive: "Increase",
            negative: "Decrease",
            equals: "No change"
        }
    },
    colorPalette: [{
        guid: "positive", 
        fill: {
            r: 0, 
            g: 193, 
            b: 141
        }
    }, {
        guid: "negative", 
        fill: {
            r: 229, 
            g: 77, 
            b: 64
        }
    }, {
        guid: "equals", 
        fill: {
            r: 148, 
            g: 161, 
            b: 173
        }
    }]
}
```