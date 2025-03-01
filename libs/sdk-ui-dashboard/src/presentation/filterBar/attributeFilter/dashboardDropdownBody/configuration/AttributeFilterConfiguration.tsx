// (C) 2022-2023 GoodData Corporation
import React, { useCallback, useEffect, useMemo } from "react";
import { IntlShape } from "react-intl";
import {
    DashboardAttributeFilterConfigMode,
    DashboardAttributeFilterConfigModeValues,
    IDashboardAttributeFilter,
    ObjRef,
} from "@gooddata/sdk-model";
import { LoadingSpinner } from "@gooddata/sdk-ui-kit";
import { useTheme } from "@gooddata/sdk-ui-theme-provider";
import { invariant } from "ts-invariant";

import { ConfigurationCategory } from "./ConfigurationCategory.js";
import { ConfigurationPanelHeader } from "./ConfigurationPanelHeader.js";
import {
    useDashboardSelector,
    selectOtherContextAttributeFilters,
    selectFilterContextAttributeFilters,
    selectSupportsElementsQueryParentFiltering,
    selectIsKDDependentFiltersEnabled,
    selectSupportsSingleSelectDependentFilters,
} from "../../../../../model/index.js";
import { ParentFiltersList } from "./parentFilters/ParentFiltersList.js";
import { AttributeDisplayFormsDropdown } from "./displayForms/AttributeDisplayFormsDropdown.js";
import { useAttributeFilterParentFiltering } from "../../AttributeFilterParentFilteringContext.js";
import { useConnectingAttributes } from "./hooks/useConnectingAttributes.js";
import { useAttributes } from "../../../../../_staging/sharedHooks/useAttributes.js";
import { AttributeTitleRenaming } from "./title/AttributeTitleRenaming.js";
import { SelectionMode } from "./selectionMode/SelectionMode.js";
import { ConfigModeSelect } from "../../../configuration/ConfigurationModeSelect.js";
import { useValidNeighbourAttributes } from "./hooks/useValidNeighbourAttributes.js";

interface IAttributeFilterConfigurationProps {
    closeHandler: () => void;
    filterRef?: ObjRef;
    filterByText: string;
    displayValuesAsText: string;
    titleText: string;
    resetTitleText: string;
    selectionTitleText: string;
    multiSelectionOptionText: string;
    singleSelectionOptionText: string;
    singleSelectionDisabledTooltip: string;
    parentFiltersDisabledTooltip: string;
    intl: IntlShape;
    modeCategoryTitleText: string;
    showConfigModeSection: boolean;
}

export const AttributeFilterConfiguration: React.FC<IAttributeFilterConfigurationProps> = (props) => {
    const {
        filterRef,
        filterByText,
        displayValuesAsText,
        titleText,
        resetTitleText,
        selectionTitleText,
        multiSelectionOptionText,
        singleSelectionOptionText,
        singleSelectionDisabledTooltip,
        parentFiltersDisabledTooltip,
        closeHandler,
        intl,
        modeCategoryTitleText,
        showConfigModeSection,
    } = props;
    const theme = useTheme();

    useEffect(() => {
        return () => {
            closeHandler();
        };
    }, [closeHandler]);

    const neighborFilters: IDashboardAttributeFilter[] = useDashboardSelector(
        selectOtherContextAttributeFilters(filterRef),
    );
    const supportsParentFiltering = useDashboardSelector(selectSupportsElementsQueryParentFiltering);
    const isDependentFiltersEnabled = useDashboardSelector(selectIsKDDependentFiltersEnabled);
    const supportsSingleSelectDependentFilters = useDashboardSelector(
        selectSupportsSingleSelectDependentFilters,
    );
    const showDependentFiltersConfiguration = supportsParentFiltering && isDependentFiltersEnabled;

    const neighborFilterDisplayForms = useMemo(() => {
        return neighborFilters.map((filter) => filter.attributeFilter.displayForm);
    }, [neighborFilters]);

    const currentFilter = useDashboardSelector(selectFilterContextAttributeFilters).find((filter) =>
        neighborFilters.every(
            (neighborFilter) =>
                filter.attributeFilter.localIdentifier !== neighborFilter.attributeFilter.localIdentifier,
        ),
    );

    invariant(currentFilter, "Cannot find current filter in the filter context store.");

    const {
        title,
        defaultAttributeFilterTitle,
        parents,
        onParentSelect,
        onConnectingAttributeChanged,
        showDisplayFormPicker,
        filterDisplayForms,
        onDisplayFormSelect,
        showResetTitle,
        onTitleUpdate,
        onTitleReset,
        selectionMode,
        onSelectionModeUpdate,
        mode,
        onModeUpdate,
    } = useAttributeFilterParentFiltering();

    const disableParentFiltersList = selectionMode === "single" && !supportsSingleSelectDependentFilters;

    const { connectingAttributesLoading, connectingAttributes } = useConnectingAttributes(
        currentFilter.attributeFilter.displayForm,
        neighborFilterDisplayForms,
    );

    const { validNeighbourAttributesLoading, validNeighbourAttributes } = useValidNeighbourAttributes(
        filterDisplayForms.selectedDisplayForm,
        neighborFilterDisplayForms,
    );

    const { attributes, attributesLoading } = useAttributes(neighborFilterDisplayForms);

    const getIsSelectionDisabled = useCallback(() => {
        if (supportsSingleSelectDependentFilters) {
            return false;
        }

        return parents.filter((parent) => parent.isSelected).length > 0;
    }, [parents, supportsSingleSelectDependentFilters]);

    if (connectingAttributesLoading || attributesLoading || validNeighbourAttributesLoading) {
        return (
            <div className="gd-loading-equalizer-attribute-filter-config-wrap">
                <LoadingSpinner
                    className="large gd-loading-equalizer-spinner"
                    color={theme?.palette?.complementary?.c9}
                />
            </div>
        );
    }

    if (!filterRef || !connectingAttributes || !validNeighbourAttributes || !attributes) {
        return null;
    }

    const handleModeChanged = (value: string) => {
        onModeUpdate(value as DashboardAttributeFilterConfigMode);
    };

    return (
        <div className="s-attribute-filter-dropdown-configuration attribute-filter-dropdown-configuration sdk-edit-mode-on">
            <ConfigurationPanelHeader />
            <AttributeTitleRenaming
                categoryTitle={titleText}
                resetTitleText={resetTitleText}
                onClick={onTitleReset}
                onChange={onTitleUpdate}
                showResetTitle={showResetTitle}
                attributeTitle={title ?? defaultAttributeFilterTitle}
            />
            <SelectionMode
                selectionTitleText={selectionTitleText}
                multiSelectionOptionText={multiSelectionOptionText}
                singleSelectionOptionText={singleSelectionOptionText}
                singleSelectionDisabledTooltip={singleSelectionDisabledTooltip}
                selectionMode={selectionMode}
                onSelectionModeChange={onSelectionModeUpdate}
                disabled={getIsSelectionDisabled()}
            />
            {showDependentFiltersConfiguration && parents.length > 0 ? (
                <ConfigurationCategory categoryTitle={filterByText} />
            ) : null}
            <ParentFiltersList
                currentFilterLocalId={currentFilter.attributeFilter.localIdentifier!}
                parents={parents}
                setParents={onParentSelect}
                onConnectingAttributeChanged={onConnectingAttributeChanged}
                connectingAttributes={connectingAttributes}
                attributes={attributes}
                disabled={disableParentFiltersList}
                disabledTooltip={parentFiltersDisabledTooltip}
                validParents={validNeighbourAttributes}
            />
            {showDisplayFormPicker ? (
                <div className="s-display-form-configuration">
                    <ConfigurationCategory categoryTitle={displayValuesAsText} />
                    <div className="configuration-panel-body">
                        <AttributeDisplayFormsDropdown
                            displayForms={filterDisplayForms.availableDisplayForms}
                            selectedDisplayForm={filterDisplayForms.selectedDisplayForm}
                            onChange={onDisplayFormSelect}
                        />
                    </div>
                </div>
            ) : null}
            {showConfigModeSection ? (
                <>
                    <ConfigurationCategory categoryTitle={modeCategoryTitleText} />
                    <ConfigModeSelect
                        intl={intl}
                        selectedMode={mode ?? DashboardAttributeFilterConfigModeValues.ACTIVE}
                        onChanged={handleModeChanged}
                    />
                </>
            ) : null}
        </div>
    );
};
