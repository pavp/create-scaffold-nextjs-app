# Project Structure

If you open the new project in a editor you will see the following structure:

```sh
.
├── api/    ## any thing related to api calls and data fetching
│ ├── index.ts
│ ├── api.ts
│ ├── endpoints.ts
│ ├── types.ts
│ └── common/
├── app/    ## app router
├── components/    ## any reusable components
│ ├── loading-screen/
│ └── footer/
├── modules/    ## modules are representations of features/objects in the real world
│ ├── login/
│ ├── employees/
│ └── admin/
├── core/    ## core files such as auth, localization, storage and more
│ ├── index.ts
│ ├── components/
│ ├── hooks/
│ └── helpers/
├── store/    ## any store configuration, e.g: redux, zustand
│ ├── settings/
│ ├── index.ts
│ └── store.ts
├── types/    ## global types
│ └── index.ts
├── ui/    ## core ui and theme configuration
│ ├── switch/
│ ├── modal/
│ └── index.ts

```

- `api`: This folder contains the API files. We provide a basic API client with redux toolkit, you just need to create query and mutation for your modules.

- `app`: This folder contains the routes of the app, along with its layout routes such as stack and tab navigation structures.

- `components:` This folder contains the components of the app. Mainly components used inside the modules folder. The only difference between ui and components is that ui is more generic and can be used in any project, while components are more specific to the project.

- `modules:` This folder contains the modules or features of the app. Mainly views used inside the app folder.

- `core:` This folder contains the core files, such as hooks, components, libs, and more. It can be shared with other projects. That’s why we are only including modules that have nothing to do with project logic. This approach helps us share code between projects and also update the starter with new features.

- `store:` This folder contains the global store of the application, serves as the centralized location for managing the application's state. This state includes data that needs to be accessible across multiple components or pages, such as user information, UI settings, and other global data. By centralizing state management, it becomes easier to manage, debug, and scale the application.

- `types:` This folder contains the global types.

- `ui:` This folder contains all the UI components and the theme configuration. We provide minimal components with a basic obytes theme. You can add your own components and theme configuration here.

# Importing files

We use absolute imports to import files using the Babel module resolver plugin and TypeScript path mapping. This approach helps us avoid long relative paths and makes the code cleaner and more readable.

Here is a simple example of how looks with absolute imports.

```sh
import { Card } from '@/components';
import { Switch, Typography, Box } from '@/ui';

export default function Home() {
    return (
        <Box>
            <Card/>
            <Switch />
            <Typography>test</Typography>
        </Box>
    );
}
```
