// (C) 2007-2019 GoodData Corporation
import React from "react";
import { FormattedMessage } from "react-intl";
import { DateFilterButton } from "../DateFilterButton/DateFilterButton.js";
import { DateFilterTextLocalized } from "../DateFilterTextLocalized/DateFilterTextLocalized.js";
import { DateFilterOption } from "../interfaces/index.js";
import { IFilterButtonCustomIcon } from "../../shared/index.js";

export interface IDateFilterButtonLocalizedProps {
    dateFilterOption: DateFilterOption;
    dateFormat: string;
    isOpen?: boolean;
    isMobile: boolean;
    customFilterName?: string;
    disabled?: boolean;
    customIcon?: IFilterButtonCustomIcon;
}

export const DateFilterButtonLocalized: React.FC<IDateFilterButtonLocalizedProps> = ({
    dateFilterOption,
    dateFormat,
    isOpen = false,
    isMobile = true,
    customFilterName,
    disabled,
    customIcon,
}) => {
    return (
        <DateFilterButton
            title={customFilterName || <FormattedMessage id="dateFilterDropdown.title" />}
            isOpen={isOpen}
            isMobile={isMobile}
            disabled={disabled}
            customIcon={customIcon}
        >
            <span className="s-button-text">
                <DateFilterTextLocalized filter={dateFilterOption} dateFormat={dateFormat} />
            </span>
        </DateFilterButton>
    );
};
