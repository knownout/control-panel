/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { ChevronUpIcon, SearchCircleIcon } from "@heroicons/react/outline";

import { Dropdown, DropdownItem, Input } from "@knownout/interface";
import { cleanString } from "@knownout/lib";

import React, { memo, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ControlPanelRootContext } from "../../../ControlPanel";

import { IControlPanelExtension, TCommonObject, TControlPanelExtensionsObject } from "../../../global/ExtensionTypes";
import { controlPanelRootState } from "../../../global/state/RecoilStates";

import useLoadingState from "../../../hooks/use-loading-state";
import useMinLoadingTime from "../../../hooks/use-min-loading-time";
import useRecoilStateObject from "../../../hooks/use-recoil-state-object";

import "./ObjectsPreviewComponent.scss";

interface IObjectsPreviewComponentProps
{
    // Available extensions list.
    extensions: TControlPanelExtensionsObject<TCommonObject, TCommonObject>;

    // Current extension.
    extension: IControlPanelExtension<TCommonObject, TCommonObject>;
}

/**
 * @internal
 */
export default memo((props: IObjectsPreviewComponentProps) => {
    const navigate = useNavigate();

    const [ query, setQuery ] = useState(String());
    const { objectID } = useParams<{ objectsType: string, objectID: string }>();

    const { setState: setRootState, state: rootState } = useRecoilStateObject(controlPanelRootState);
    const { startLoading, finishLoading } = useLoadingState();

    const { locale } = useContext(ControlPanelRootContext);

    const extensionKeys = Object.keys(props.extensions);

    // START

    const dropdownRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!dropdownRef.current) return;
        const itemsHolder = dropdownRef.current.querySelector("div.items") as HTMLDivElement;

        itemsHolder.style.height = itemsHolder.children.length * 58 + 10 + "px";

    }, [ dropdownRef.current ]);

    // END

    // Require objects preview from extension.
    useEffect(() => {
        startLoading("objects-preview");

        // Require or search for objects preview.
        const requireFunction = cleanString(query).length < 2 ? props.extension.requireObjectsPreview
            : props.extension.requireObjectsPreviewByQuery.bind(null, query);

        requireFunction().then(objectsPreview => {
            // const objectsPreview = objects.filter(object => object.id !== objectID);

            useMinLoadingTime(() => setRootState({ objectsPreview }))
                .then(() => finishLoading("objects-preview"));
        });
    }, [ rootState.objectsType, query, props.extension ]);

    // Get selected item at top.
    useEffect(() => {
        if (!objectID || rootState.objectsPreview.length < 1) return;

        const dispatcher = async () => {
            // Check if objectsPreview contains a selected object or require it from extension.
            const object = rootState.objectsPreview.filter(object => object.id == objectID)[0]
                || await props.extension.requireObjectPreviewByKey(objectID);

            if (!object) return navigate(`/${ rootState.objectsType }`);
            setRootState({ selectedObject: object });
        };

        dispatcher();
    }, [ objectID, props.extension, rootState.objectsPreview ]);

    // Object preview element renderer.
    const renderObjectPreview = useCallback((object: TCommonObject) => {
        return <div className="object-preview-wrapper" key={ object.id + "_OPK" } data-id={ object.id }
                    onClick={ () => {
                        if (object.id != objectID) navigate(`/${ rootState.objectsType }/${ object.id }`);
                        else {
                            navigate(`/${ rootState.objectsType }`);
                            setRootState({ selectedObject: undefined });
                        }
                    } }>

            { props.extension.renderObjectPreview(object) }
        </div>;
    }, [ rootState.objectsType, props.extension, objectID ]);

    return <div className="objects-preview">
        <Dropdown defaultTitle="..." defaultSelected={ extensionKeys.indexOf(rootState.objectsType) }
                  icon={ <ChevronUpIcon /> } ref={ dropdownRef }>

            { Object.values(props.extensions).map(extension => {
                return <DropdownItem key={ extension.key + "_EK" } children={ extension.name } onClick={ () => {
                    // Show loading screen and then navigate.
                    if (rootState.objectsType != extension.key) {
                        setTimeout(() => navigate("/" + extension.key), 200);
                        startLoading("objects-preview");
                    }
                } } />;
            }) }
        </Dropdown>
        { locale && <Input placeholder={ locale.general.previewSearch } icon={ <SearchCircleIcon /> }
                           onReturn={ setQuery } /> }

        { rootState.selectedObject && <div className="selected-object">
            { renderObjectPreview(rootState.selectedObject) }
        </div> }
        <div className="objects-preview-list">
            { rootState.objectsPreview.filter(object => object.id != objectID).map(renderObjectPreview) }
        </div>
    </div>;
});
