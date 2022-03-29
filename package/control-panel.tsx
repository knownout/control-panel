/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import "./control-panel.scss";
import React, { useCallback, useContext, useLayoutEffect, useRef } from "react";
import { classNames } from "@knownout/lib";
import { Dropdown, DropdownItem, Input } from "@knownout/interface";
import { IControlPanelExtension, IControlPanelViewExtension } from "./src/extensions/typings";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { atom, useRecoilState } from "recoil";

interface IControlPanelProps
{
    extensions: IControlPanelExtension<unknown, unknown>[];

    viewExtensions?: IControlPanelViewExtension[];
}

const selectedObjectsType = atom<string | null>({
    key: "controlPanel.main.selectedObjectsType",
    default: "Материалы"
});

function useDropdownOpenStateSwitcher () {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!dropdownRef.current) return;

        const target = dropdownRef.current.querySelector("div.items") as HTMLDivElement;
        target.style.height = "0px";
    }, [ dropdownRef.current ]);

    const onDropdownOpenStateChange = useCallback((open: boolean) => {
        const root = dropdownRef.current as HTMLDivElement,
            target = root.querySelector("div.items") as HTMLDivElement;
        if (!target) return;

        target.style.height = (open ? target.scrollHeight : 0) + "px";
    }, [ dropdownRef ]);

    return [ dropdownRef, onDropdownOpenStateChange ] as
        [ typeof dropdownRef, typeof onDropdownOpenStateChange ];
}

function useExtensionNames (extensions?: IControlPanelContext["extensions"]) {
    const keys = Object.keys(extensions || {});

    if (!extensions || keys.length < 1)
        throw new Error("At least one extension required to use control panel");

    return keys;
}

function convertExtensions<T = IControlPanelExtension<unknown, unknown>> (extensions: T[]) {
    return extensions.map(extension => ({ [(extension as any).name]: extension }))
        .reduce((a, b) => Object.assign(a, b)) as { [key: string]: T };
}

interface IControlPanelContext
{
    extensions: { [key: string]: IControlPanelExtension<unknown, unknown> };

    viewExtensions: { [key: string]: IControlPanelViewExtension };
}

const ControlPanelContext = React.createContext<Partial<IControlPanelContext>>({});

export default function ControlPanel (props: IControlPanelProps) {
    const controlPanelClassName = classNames("control-panel", "cpl-root");

    const extensions = convertExtensions(props.extensions);
    const viewExtensions = props.viewExtensions
        ? convertExtensions<IControlPanelViewExtension>(props.viewExtensions)
        : {};

    return <main className={ controlPanelClassName }>
        <ControlPanelContext.Provider value={ { extensions, viewExtensions } }>
            <ControlPanelObjectsView />
            <section className="cpl-object-editor">
                Nothing.
            </section>
        </ControlPanelContext.Provider>
    </main>;
}

function ControlPanelObjectsView () {
    const { extensions } = useContext(ControlPanelContext);

    const [ selectedObjectType, setSelectedObjectType ] = useRecoilState(selectedObjectsType);
    const [ dropdownRef, onDropdownOpenStateChange ] = useDropdownOpenStateSwitcher();
    const extensionNames = useExtensionNames(extensions);

    return <section className="cpl-objects-view">
        <Dropdown defaultTitle="Select object type" defaultSelected={ 0 } ref={ dropdownRef }
                  onOpenStateChange={ onDropdownOpenStateChange } icon={ <ChevronDownIcon /> }
                  onSelectionChange={ setSelectedObjectType }>
            { extensionNames.map(name => <DropdownItem key={ name + " object-type" } children={ name } />) }
        </Dropdown>
        <Input placeholder={ `Поиск по "${ selectedObjectType }"` } />
        <div className="cpl-object-preview-list">
            Nothing.
        </div>
    </section>;
}
