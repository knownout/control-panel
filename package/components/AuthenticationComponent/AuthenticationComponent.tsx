/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import React, { memo, useCallback, useContext, useRef, useState } from "react";
import { Button, Input } from "@knownout/interface";
import { FingerPrintIcon, RefreshIcon } from "@heroicons/react/outline";

import "./AuthenticationComponent.scss";
import { ExclamationCircleIcon, IdentificationIcon, KeyIcon, ShieldExclamationIcon } from "@heroicons/react/solid";
import { ControlPanelRootContext } from "../../ControlPanel";
import { TAccountData } from "../../global/AuthenticationTypes";
import { useNavigate } from "react-router-dom";
import useRecoilStateObject from "../../hooks/use-recoil-state-object";
import { popupComponentState } from "../PopupComponent";
import useRecaptcha from "../../hooks/use-recaptcha";
import { loaderComponentState } from "../LoaderComponent";

const errorPopupOptions = (callback: () => void) => ({
    open: true,
    title: "Не удалось войти",
    titleIcon: <ShieldExclamationIcon />,
    textContent: [
        "Сервер отклонил запрос на авторизацию, это могло произойти за-за того, что вы ввели неверные" +
        " данные аккаунта",
        "Однако, есть вероятность, что ошибка произошла на стороне сервера. Проверьте данные для вода и" +
        " свяжитесь с разработчиком, если уверены, что ваши данные верны"
    ],
    buttons: [ {
        children: "Попробовать снова",
        icon: <RefreshIcon />,
        onClick: callback
    } ]
});

const recaptchaErrorPopupOptions = (error: string) => ({
    open: true,
    title: "Ошибка модуля",
    titleIcon: <ExclamationCircleIcon />,
    textContent: [
        "Модуль не смог корректно обработать запрос, из-за чего произошла критическая ошибка",
        "Попробуйте перезагрузить страницу и повторить попытку. Если ошибка продолжит появляться, свяжитесь с" +
        " разработчиком модуля для получения технической поддержки"
    ],

    hintContent: error,
    buttons: [ {
        children: "Перезагрузить страницу",
        icon: <RefreshIcon />,
        onClick: () => window.location.reload()
    } ]
});

export default memo(() => {
    const navigate = useNavigate();

    const loginComponent = useRef<HTMLInputElement>(null),
        passwordComponent = useRef<HTMLInputElement>(null);

    const [ login, setLogin ] = useState(false);
    const [ password, setPassword ] = useState(false);

    const { setState: setPopupData } = useRecoilStateObject(popupComponentState);
    const { setState: setLoading } = useRecoilStateObject(loaderComponentState);

    const { authenticator, recaptchaPublicToken } = useContext(ControlPanelRootContext);
    if (!authenticator) throw new Error("No authenticator extension provided");

    const onComponentLoginButtonClick = useCallback(async () => {
        if (!loginComponent.current || !passwordComponent.current) return;

        const accountData: TAccountData = {
            password: passwordComponent.current.value,
            username: loginComponent.current.value
        };

        const token = recaptchaPublicToken ? await useRecaptcha(recaptchaPublicToken).catch(error => {
            setPopupData(recaptchaErrorPopupOptions(error));
            throw new Error(error);
        }) : undefined;

        await authenticator.requireServerAuthentication(accountData, token || undefined).then(response => {
            if (!response) return setPopupData(errorPopupOptions(() => {
                setPopupData(popup => Object.assign({}, popup, { open: false }));

                if (passwordComponent.current) {
                    passwordComponent.current.value = "";
                    passwordComponent.current.dispatchEvent(new Event("input", { bubbles: true }));
                }
                if (loginComponent.current) loginComponent.current.focus();
            }));

            setLoading(true);
            setTimeout(() => {
                authenticator.cacheAccountData(accountData);
                navigate("/");
            }, 200);
        });

        await new Promise(r => setTimeout(r, 100));
    }, [ recaptchaPublicToken, authenticator, setPopupData, loginComponent.current, passwordComponent.current ]);

    if (authenticator.requireCachedAccountData()) return null;
    return <div className="authentication-form">
        <h1>Авторизация</h1>
        <p>
            Введите данные своего аккаунта чтобы продолжить.
            Если у Вас нет данных авторизации, покиньте эту страницу
        </p>

        <Input placeholder="Имя пользователя" icon={ <IdentificationIcon /> } ref={ loginComponent }
               onInput={ value => setLogin(value.length > 3) } />

        <Input placeholder="Пароль" type="password" icon={ <KeyIcon /> } ref={ passwordComponent }
               onInput={ value => setPassword(value.length > 3) } />

        <div className="recaptcha-hint">
            <span>Форма защищена от спама при помощи Google reCAPTCHA</span>
            <div className="recaptcha-links">
                <a href="https://www.google.com/intl/ru/policies/terms/" className="ui clean link">
                    Условия использования
                </a>
                <a href="https://www.google.com/intl/ru/policies/privacy/" className="ui clean link">
                    Конфиденциальность
                </a>
            </div>
        </div>

        <Button icon={ <FingerPrintIcon /> } onClick={ onComponentLoginButtonClick } disableOnLoading={ true }
                disabled={ !login || !password }>
            Войти в аккаунт
        </Button>
    </div>;
});
