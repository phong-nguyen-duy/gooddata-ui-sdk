// (C) 2023 GoodData Corporation
import React, { createContext, useContext, useEffect, useState } from "react";
import noop from "lodash/noop.js";
import isEmpty from "lodash/isEmpty.js";
import { ICatalogAttributeHierarchy, ObjRef } from "@gooddata/sdk-model";

import { useBackendProvider } from "./useBackendProvider.js";
import {
    EmptyParamCallback,
    IAttributeData,
    ICatalogAttributeData,
    SaveOrUpdateCallback,
    SetLoadingCallback,
} from "./types.js";
import {
    appendEmptyAttribute,
    convertToCatalogAttributeDataByRefs,
    findCatalogAttributeByRef,
} from "./utils.js";

interface IAttributeHierarchyDialogProviderProps {
    initialAttributeRef?: ObjRef;
    editingAttributeHierarchy?: ICatalogAttributeHierarchy;
    onClose?: EmptyParamCallback;
    onSaveOrUpdateSuccess?: SaveOrUpdateCallback;
    onDeleteSuccess?: EmptyParamCallback;
    children: React.ReactNode;
}

export interface IAttributeHierarchyDialogProviderData {
    isEditing: boolean;
    attributes: IAttributeData[];
    title: string;
    isLoading: boolean;
    setLoading: SetLoadingCallback;
    shouldDisplayDeleteConfirmation: boolean;
    setDisplayDeleteConfirmation: (isDisplay: boolean) => void;
    onClose: EmptyParamCallback;
    onUpdateTitle: (title: string) => void;
    onAddEmptyAttribute: (baseRowIndex: number) => void;
    onCompleteAttribute: (selectedItem: ICatalogAttributeData, rowIndex: number) => void;
    getValidAttributes: (rowIndex: number) => Promise<ICatalogAttributeData[]>;
    onDeleteAttribute: (rowIndex: number) => void;
    onSaveAttributeHierarchy: EmptyParamCallback;
    onDeleteAttributeHierarchy: (isDisplay: boolean) => void;
}

export const AttributeHierarchyDialogProviderContext = createContext<IAttributeHierarchyDialogProviderData>({
    isEditing: false,
    attributes: [],
    title: "",
    isLoading: true,
    setLoading: noop,
    shouldDisplayDeleteConfirmation: false,
    setDisplayDeleteConfirmation: noop,
    onClose: noop,
    onUpdateTitle: noop,
    onAddEmptyAttribute: noop,
    onCompleteAttribute: noop,
    onDeleteAttribute: noop,
    onSaveAttributeHierarchy: noop,
    onDeleteAttributeHierarchy: noop,
    getValidAttributes: () => Promise.resolve([]),
});

export const useAttributeHierarchyDialog = () =>
    useContext<IAttributeHierarchyDialogProviderData>(AttributeHierarchyDialogProviderContext);

export const AttributeHierarchyDialogProvider: React.FC<IAttributeHierarchyDialogProviderProps> = ({
    initialAttributeRef,
    editingAttributeHierarchy,
    children,
    onClose,
    onSaveOrUpdateSuccess,
    onDeleteSuccess,
}) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState(editingAttributeHierarchy?.attributeHierarchy?.title ?? "");
    const [attributes, setAttributes] = useState<IAttributeData[]>([]);
    const [shouldDisplayDeleteConfirmation, setDisplayDeleteConfirmation] = useState<boolean>();
    const isEditing = !!editingAttributeHierarchy;

    const { catalogAttributesMap, onSaveAttributeHierarchy, onDeleteAttributeHierarchy, getValidAttributes } =
        useBackendProvider({
            setLoading,
            title,
            attributes,
            editingAttributeHierarchy,
            onClose,
            onSaveOrUpdateSuccess,
            onDeleteSuccess,
        });

    const handleAddEmptyAttribute = (baseRowIndex: number) => {
        setAttributes(appendEmptyAttribute(attributes, baseRowIndex));
    };

    const handleCompeteAttribute = (selectedAttribute: ICatalogAttributeData, rowIndex: number) => {
        const attribute: IAttributeData = {
            ...selectedAttribute,
            completed: true,
        };

        const newAttributes = [...attributes];
        newAttributes[rowIndex] = attribute;

        setAttributes(newAttributes);
    };

    const handleDeleteAttribute = (rowIndex: number) => {
        const newAttributes = [...attributes];
        newAttributes.splice(rowIndex, 1);
        setAttributes(newAttributes);
    };

    useEffect(() => {
        if (editingAttributeHierarchy && !isEmpty(catalogAttributesMap)) {
            const refs = editingAttributeHierarchy.attributeHierarchy.attributes;
            const initAttributes = convertToCatalogAttributeDataByRefs(catalogAttributesMap, refs).map(
                (attribute) => ({
                    ...attribute,
                    completed: true,
                }),
            );
            setAttributes(initAttributes);
            return;
        }

        if (initialAttributeRef && !isEmpty(catalogAttributesMap)) {
            const initialAttribute = findCatalogAttributeByRef(catalogAttributesMap, initialAttributeRef);
            if (initialAttribute) {
                setAttributes([
                    {
                        ...initialAttribute,
                        completed: true,
                    },
                ]);
            }
        }
    }, [initialAttributeRef, editingAttributeHierarchy, catalogAttributesMap]);

    return (
        <AttributeHierarchyDialogProviderContext.Provider
            value={{
                isEditing,
                attributes,
                title,
                isLoading,
                setLoading,
                shouldDisplayDeleteConfirmation,
                setDisplayDeleteConfirmation,
                onClose,
                onUpdateTitle: setTitle,
                onAddEmptyAttribute: handleAddEmptyAttribute,
                onCompleteAttribute: handleCompeteAttribute,
                getValidAttributes,
                onDeleteAttribute: handleDeleteAttribute,
                onSaveAttributeHierarchy,
                onDeleteAttributeHierarchy,
            }}
        >
            {children}
        </AttributeHierarchyDialogProviderContext.Provider>
    );
};
