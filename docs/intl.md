# Next-intl in a Next.js Project

## What is next-intl?

[next-intl](https://next-intl-docs.vercel.app/) is a library designed for internationalization (i18n) in Next.js applications. It provides a comprehensive solution for managing multiple languages and localizations in a web application, simplifying the process of translating and adapting content for different global audiences.

In summary, `next-intl` is a powerful tool for any developer looking to create Next.js applications with multi-language support, enhancing accessibility and user experience in a global context.

## What is next-intl for?

### 1. **Translation Management**

`next-intl` allows developers to easily handle the translation of content in a Next.js application. This includes defining and loading translation files for different languages, ensuring that the application content can be displayed in the user's preferred language.

### 2. **Localized Data Formatting**

In addition to managing translations, `next-intl` facilitates the formatting of data that varies by locale, such as dates, numbers, and currencies. This ensures that data is presented in a consistent and familiar way for users from different regions.

### 3. **Dynamic Language Switching**

`next-intl` enables users to dynamically change the language of the interface without needing to reload the page or lose the application state. This is essential for applications that need to support multiple languages and offer a smooth user experience.

# About t8r

[t8r](https://t8r.nextlane.com/) is an internally developed web application by NextLane, designed to manage the use of translations between a translation service and the company's internal projects.

## Purpose of t8r

The primary goal of t8r is to streamline and simplify the localization process for NextLane's projects. By providing a centralized platform, t8r ensures that translation keys and values are consistently managed and updated, facilitating efficient and accurate internationalization across all projects.

## Key Features

- **Centralized Translation Management**: t8r allows teams to manage all translations in one place, reducing the complexity of handling multiple translation files across different projects.
- **Easy Integration**: Projects can easily sync with t8r to fetch the latest translations, ensuring that the application always displays the most up-to-date content.
- **User-Friendly Interface**: The web application provides an intuitive interface for adding, updating, and reviewing translation keys and their corresponding values, making it accessible for both developers and non-technical team members.
- **Context-Based Organization**: Translations are organized by context, which typically corresponds to different sections or modules of an application, helping to keep translations organized and relevant.

By using t8r, NextLane ensures a smooth and efficient workflow for managing translations, ultimately enhancing the global reach and user experience of its applications.

# Adding a New Translation with next-intl and t8r

## Prerequisites

1. Ensure you have access to [t8r.nextlane.com](https://t8r.nextlane.com/).
2. You have the project set up.

## Steps to Add a New Translation

### 1. Access t8r.nextlane.com

- Go to [t8r.nextlane.com](https://t8r.nextlane.com/).
- Log in with your credentials.

### 2. Select Your Project

- From the dashboard, select the project where you want to add the new translation.

### 3. Choose the Context

- Within your project, select the specific context where you want to add the new translation. The context typically corresponds to a section or module of your application.

### 4. Add the Key and Value

- In the selected context, add a new translation key and its value.
  - **Key**: This is the identifier used in your code to reference this translation.
  - **Value (Spanish)**: The translated text in Spanish.

For example:

- **Key**: `greeting`
- **Value (Spanish)**: `Hola`

### 5. Use the Translation in Your Application

- Implement the hook in your Next.js components to display the translations:

```javascript
import { useTranslations } from 'next-intl';

export const HomeView = () => {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('greeting')}</h1> {/* This will display 'Hola' in the Spanish locale */}
    </div>
  );
};
```
