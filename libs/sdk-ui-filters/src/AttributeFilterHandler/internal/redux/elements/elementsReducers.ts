// (C) 2021-2022 GoodData Corporation
import identity from "lodash/identity.js";
import { PayloadAction } from "@reduxjs/toolkit";
import { IElementsQueryAttributeFilter } from "@gooddata/sdk-backend-spi";
import { IAttributeMetadataObject, IMeasure, IRelativeDateFilter, SortDirection } from "@gooddata/sdk-model";
import { GoodDataSdkError } from "@gooddata/sdk-ui";

import { AttributeFilterReducer } from "../store/state.js";
import { Correlation } from "../../../types/index.js";

const setElementsTotalCount: AttributeFilterReducer<
    PayloadAction<{
        totalCount: number;
    }>
> = (state, action) => {
    state.elements.totalCount = action.payload.totalCount;
};

const initTotalCount: AttributeFilterReducer<PayloadAction<{ correlation: Correlation }>> = identity;

const initTotalCountStart: AttributeFilterReducer<PayloadAction<{ correlation: Correlation }>> = (state) => {
    state.elements.totalCountInitialization.status = "loading";
};

const initTotalCountSuccess: AttributeFilterReducer<PayloadAction<{ correlation: Correlation }>> = (
    state,
) => {
    state.elements.totalCountInitialization.status = "success";
};

const initTotalCountError: AttributeFilterReducer<
    PayloadAction<{ error: GoodDataSdkError; correlation: Correlation }>
> = (state, action) => {
    state.elements.totalCountInitialization.status = "error";
    state.elements.totalCountInitialization.error = action.payload.error;
};

const initTotalCountCancel: AttributeFilterReducer<PayloadAction<{ correlation: Correlation }>> = (state) => {
    state.elements.totalCountInitialization.status = "canceled";
};

const setElementsTotalCountWithCurrentSettings: AttributeFilterReducer<
    PayloadAction<{
        totalCount: number;
    }>
> = (state, action) => {
    state.elements.totalCountWithCurrentSettings = action.payload.totalCount;
};

const setOffset: AttributeFilterReducer<PayloadAction<{ offset: number }>> = (state, action) => {
    state.elements.currentOptions.offset = action.payload.offset;
};

const setSearch: AttributeFilterReducer<PayloadAction<{ search: string }>> = (state, action) => {
    state.elements.currentOptions.search = action.payload.search;
};

const setOrder: AttributeFilterReducer<PayloadAction<{ order: SortDirection }>> = (state, action) => {
    state.elements.currentOptions.order = action.payload.order;
};

const setLimit: AttributeFilterReducer<PayloadAction<{ limit: number }>> = (state, action) => {
    state.elements.currentOptions.limit = action.payload.limit;
};

const setLimitingAttributeFilters: AttributeFilterReducer<
    PayloadAction<{ filters: IElementsQueryAttributeFilter[] }>
> = (state, action) => {
    state.elements.currentOptions.limitingAttributeFilters = action.payload.filters;
};

const setLimitingAttributeFiltersAttributes: AttributeFilterReducer<
    PayloadAction<{ attributes: IAttributeMetadataObject[] }>
> = (state, action) => {
    state.elements.limitingAttributeFiltersAttributes = action.payload.attributes;
};

const setLimitingMeasures: AttributeFilterReducer<PayloadAction<{ filters: IMeasure[] }>> = (
    state,
    action,
) => {
    state.elements.currentOptions.limitingMeasures = action.payload.filters;
};

const setLimitingDateFilters: AttributeFilterReducer<PayloadAction<{ filters: IRelativeDateFilter[] }>> = (
    state,
    action,
) => {
    state.elements.currentOptions.limitingDateFilters = action.payload.filters;
};

/**
 * @internal
 */
export const elementsReducers = {
    setElementsTotalCount,
    initTotalCount,
    initTotalCountStart,
    initTotalCountSuccess,
    initTotalCountError,
    initTotalCountCancel,
    setElementsTotalCountWithCurrentSettings,
    setOffset,
    setLimit,
    setSearch,
    setOrder,
    setLimitingAttributeFilters,
    setLimitingMeasures,
    setLimitingDateFilters,
    setLimitingAttributeFiltersAttributes,
};
