/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import ControlPanelLocale from "./LocaleTypes";
import ICommonPopupStatesLocale = ControlPanelLocale.ICommonPopupStatesLocale;

export default {
    Authenticator: {
        Russian: {
            title: "Авторизация",
            description: "Введите данные своего аккаунта чтобы продолжить. "
                + "Если у Вас нет данных авторизации, покиньте эту страницу",

            usernameInputPlaceholder: "Имя пользователя",
            passwordInputPlaceholder: "Пароль",

            recaptchaDescription: "Форма защищена от спама при помощи Google reCAPTCHA",
            recaptchaTermsLabel: "Условия использования",
            recaptchaPrivacyLabel: "Конфиденциальность",

            loginButtonLabel: "Войти в аккаунт"
        } as ControlPanelLocale.IAuthenticatorLocale,

        English: {
            title: "Authentication",
            description: "Provide your account information to continue. "
                + "If you do not have authorization data, leave this page",

            usernameInputPlaceholder: "User name",
            passwordInputPlaceholder: "Password",

            recaptchaDescription: "The form is spam protected with Google reCAPTCHA",
            recaptchaTermsLabel: "Terms of Use",
            recaptchaPrivacyLabel: "Confidentiality",

            loginButtonLabel: "Sign in"
        } as ControlPanelLocale.IAuthenticatorLocale
    },

    Popup: {
        Russian: {
            AuthenticationFailure: {
                title: "Не удалось войти",
                textContent: [
                    "Сервер отклонил запрос на авторизацию, это могло произойти иа-за того, что вы ввели неверные" +
                    " данные аккаунта",
                    "Однако, есть вероятность, что ошибка произошла на стороне сервера. Проверьте данные для вода и" +
                    " свяжитесь с разработчиком, если уверены, что ваши данные верны"
                ],

                buttonLabel: "Попробовать снова"
            } as ControlPanelLocale.IPopupStateLocale,

            ModuleCriticalFailure: {
                title: "Ошибка модуля",
                textContent: [
                    "Модуль не смог корректно обработать запрос, из-за чего произошла критическая ошибка",
                    "Попробуйте перезагрузить страницу и повторить попытку. Если ошибка продолжит появляться, свяжитесь с"
                    +
                    " разработчиком модуля для получения технической поддержки"
                ],

                buttonLabel: "Перезагрузить страницу"
            } as ControlPanelLocale.IPopupStateLocale,

            WelcomeMessage: {
                title: "Добро пожаловать в модуль «Панель администрирования»",

                versionLabel: "Текущая версия модуля",

                moduleDescription: "Данный модуль представляет из себя веб-инструмент, встраиваемый в "
                    + "веб-сайт на стадии разработки, предоставляющий определенные интерфейсы "
                    + "для взаимодействия с внутренним содержимым веб-сайта",

                aboutModuleButton: "Подробнее о модуле",
                faqButton: "Инструкция к эксплуатации",
                extensionsButton: "Активные расширения",
                developersButton: "Для разработчиков",

                appearHint: "Данное сообщение будет появляться после каждой перезагрузки браузера, "
                    + "если не выбрана опция «Больше не показывать»",

                closeAndNotShowButton: "Закрыть и больше не показывать",
                closeButton: "Закрыть сообщение"
            } as ICommonPopupStatesLocale["WelcomeMessage"]
        },

        English: {
            AuthenticationFailure: {
                title: "Failed to login",
                textContent: [
                    "Server rejected the authorization request, this could be due to the fact that you entered"
                    + " incorrect account information",
                    "However, there is a possibility that the error occurred on the server side. Check the data for"
                    + " water and contact the developer if you are sure that your data is correct"
                ],

                buttonLabel: "Try again"
            } as ControlPanelLocale.IPopupStateLocale,

            ModuleCriticalFailure: {
                title: "Module failure",
                textContent: [
                    "Module was unable to process the request correctly, which resulted in a critical error",
                    "Please reload the page and try again. If the error continues to appear, contact the module"
                    + " developer for technical support"
                ],

                buttonLabel: "Reload page"
            } as ControlPanelLocale.IPopupStateLocale,

            WelcomeMessage: {
                title: "Welcome to the «Administration Panel» module",

                versionLabel: "Current version of module",

                moduleDescription: "This module is a web tool that is embedded in a "
                    + "website at the development stage, providing certain interfaces for "
                    + "interacting with the internal content of the website",

                aboutModuleButton: "More about module",
                faqButton: "Module usage instructions",
                extensionsButton: "Active extensions",
                developersButton: "For developers",

                appearHint: "This message will appear after every restart of the browser, unless "
                    + "the «Do not show again» option is selected",

                closeAndNotShowButton: "Close and don't show again",
                closeButton: "Close message"
            } as ICommonPopupStatesLocale["WelcomeMessage"]
        }
    },

    General: {
        Russian: {
            previewSearch: "Поиск по разделу"
        },

        English: {
            previewSearch: "Search by section"
        }
    }
};
