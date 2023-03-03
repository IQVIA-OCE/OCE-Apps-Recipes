import React from 'react';
import * as helpers from './helper';
import { territoryIds, layoutData } from './../constants/mockData'
jest.mock("react-native", () => {
    const RN = jest.requireActual("react-native");

    RN.UIManager.getViewManagerConfig = name => {
        return {};
    };

    Object.defineProperty(RN, "findNodeHandle", {
        get: jest.fn(() => () => 1),
        set: jest.fn()
    });

    return RN;
});
describe('helperMethods', () => {
    it('should split the string from an array and each value should enclose with single quote', () => {
        expect(helpers.splitStringFromArray(territoryIds, 'Territory2Id')).toStrictEqual("'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'");
    })
    it('should split the string from another string by delimiter and each non empty values should enclose with single quote', () => {
        expect(helpers.splitStringByDelimiter(';DM - San Francisco 20D02;TM - SPC - Aurora 20A02T06;TM - SPC - Joliet 20A02T11;', ';'))
            .toStrictEqual("'DM - San Francisco 20D02','TM - SPC - Aurora 20A02T06','TM - SPC - Joliet 20A02T11'");
    })
    it('should calcualte top position from given child element', () => {
        const position = {
            x: 100,
            y: 200,
            width: 300,
            height: 100
        }
        const childElement = {
            x: 30,
            y: 20,
            width: 100,
            height: 50
        }

        expect(helpers.calcTopPostion(position, childElement)).toBe(224);
    })


    it('should calcualte right position from given child element', () => {
        const position = {
            x: 100,
            y: 200,
            width: 300,
            height: 100
        }
        expect(helpers.calcRightPosition(position)).toBe(197);
    })
    it('should map access level picklist', () => {
        expect(helpers.mapAccessLevels(layoutData)).toStrictEqual([{
            active: true,
            defaultValue: false,
            label: "Read Only",
            validFor: null,
            value: "Read",
        },
        {
            active: true,
            defaultValue: false,
            label: "Read/Write",
            validFor: null,
            value: "Edit",
        },
        {
            active: true,
            defaultValue: false,
            label: "Owner",
            validFor: null,
            value: "All",
        }]);
    })
})


const ref = {
    current: {
        scrollTo: jest.fn()
    }
}