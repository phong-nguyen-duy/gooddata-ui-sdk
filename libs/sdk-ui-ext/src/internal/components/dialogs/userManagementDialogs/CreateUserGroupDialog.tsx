// (C) 2023 GoodData Corporation

import React, { useState } from "react";
import { useIntl } from "react-intl";
import { v4 as uuid } from "uuid";
import { useBackendStrict } from "@gooddata/sdk-ui";
import { ConfirmDialogBase, IAlignPoint, Input, Overlay, useToastMessage } from "@gooddata/sdk-ui-kit";

import { messages } from "./locales.js";

const alignPoints: IAlignPoint[] = [{ align: "cc cc" }];

/**
 * @internal
 */
export interface ICreateUserGroupDialogProps {
    organizationId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

/**
 * @internal
 */
export const CreateUserGroupDialog: React.FC<ICreateUserGroupDialogProps> = ({
    organizationId,
    onSuccess,
    onCancel,
}) => {
    const intl = useIntl();
    const backend = useBackendStrict();
    const { addSuccess, addError } = useToastMessage();
    const [userGroupName, setUserGroupName] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    const onSubmit = () => {
        setIsProcessing(true);
        backend
            .organization(organizationId)
            .users()
            .createUserGroup({
                id: uuid(),
                ref: undefined,
                name: userGroupName,
            })
            .then(() => {
                addSuccess(messages.userGroupCreatedSuccess);
                onSuccess();
                onCancel();
            })
            .catch(() => {
                addError(messages.userGroupCreatedFailure);
            })
            .finally(() => setIsProcessing(false));
    };

    const onChange = (value: string) => setUserGroupName(value);

    return (
        <Overlay
            alignPoints={alignPoints}
            isModal={true}
            positionType="fixed"
            className="gd-user-management-dialog"
        >
            <ConfirmDialogBase
                onSubmit={onSubmit}
                isSubmitDisabled={userGroupName === "" || isProcessing}
                onCancel={onCancel}
                isPositive={true}
                className="s-user-management-delete-confirm-dialog gd-user-management-create-dialog"
                headline={intl.formatMessage(messages.createUserGroupDialogTitle)}
                submitButtonText={intl.formatMessage(messages.createUserGroupButton)}
                showProgressIndicator={isProcessing}
                cancelButtonText={intl.formatMessage(messages.cancelUserGroupButton)}
            >
                <Input
                    value={userGroupName}
                    onChange={onChange}
                    autofocus={true}
                    placeholder={intl.formatMessage(messages.createUserGroupInputPlaceholder)}
                    className="gd-user-management-create-user-group-input"
                />
            </ConfirmDialogBase>
        </Overlay>
    );
};
