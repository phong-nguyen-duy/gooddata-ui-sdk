// (C) 2023 GoodData Corporation

import React from "react";
import { IAlignPoint, Overlay } from "@gooddata/sdk-ui-kit";

import { IUserMember } from "./types.js";
import { AddUser } from "./Users/AddUser.js";
import { OrganizationIdProvider } from "./OrganizationIdContext.js";

const alignPoints: IAlignPoint[] = [{ align: "cc cc" }];
const noGrantedUsers: IUserMember[] = [];

/**
 * @internal
 */
export interface IAddUsersToUserGroupsDialogProps {
    userGroupIds: string[];
    organizationId: string;
    onSuccess: () => void;
    onClose: () => void;
}

/**
 * @internal
 */
export const AddUsersToUserGroupsDialog: React.FC<IAddUsersToUserGroupsDialogProps> = ({
    userGroupIds,
    organizationId,
    onSuccess,
    onClose,
}) => {
    return (
        <OrganizationIdProvider organizationId={organizationId}>
            <Overlay alignPoints={alignPoints} isModal={true} positionType="fixed">
                <AddUser
                    userGroupIds={userGroupIds}
                    grantedUsers={noGrantedUsers}
                    enableBackButton={false}
                    onSubmit={onSuccess}
                    onCancel={onClose}
                    onClose={onClose}
                />
            </Overlay>
        </OrganizationIdProvider>
    );
};
