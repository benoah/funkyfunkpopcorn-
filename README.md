# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Funky Popcorn

Dette prosjektet er en film- og serieplattform inspirert av Netflix, som viser populære filmer og serier ved hjelp av **React**, **TypeScript**, **Tailwind CSS**, **Chakra UI**, og flere andre verktøy. Den inneholder en navigasjonsmeny, hero-seksjon med trailere, og en trending-seksjon for populære filmer.

## Innhold

- [Funksjoner](#funksjoner)
- [Installasjon](#installasjon)
- [Teknologi](#teknologi)
- [Bruk](#bruk)
- [Videre arbeid](#videre-arbeid)

## Funksjoner

- **Navigasjonsmeny**:
  - Skiftende bakgrunn basert på hvor mye brukeren har scrollet.
  - Netflix-inspirerte lenker med dynamisk fargeendring ved hover.
  - Responsiv design med hamburger-meny på mobil.
  - Ytelsesoptimalisert scrolling med `lodash.throttle`.
- **HeroSection**:

  - Viser de mest populære filmene med mulighet til å spille av trailere fra YouTube.
  - Fullskjerm-modus for traileravspilling med _screenfull_.
  - Animasjoner og smooth overganger med **Framer Motion**.

- **Trending-seksjon**:
  - Viser de mest populære filmene i en horisontal liste med mulighet for å åpne en modal for mer informasjon.
  - Autoplay-funksjon for trailere når en film velges.
  - Lazy-loading for bedre ytelse.

## Installasjon

Følg disse stegene for å installere prosjektet lokalt:

1. **Klon repoet**:

   ```bash
   git clone https://github.com/benoah/funkyfunkpopcorn-.git
   cd funkyfunkpopcorn-
   ```

2. **Installer avhengigheter**:

   ```bash
   npm install
   ```

3. **Start prosjektet**:

   ```bash
   npm start
   ```

4. Åpne prosjektet i nettleseren din på [http://localhost:3000](http://localhost:3000).

## Teknologi

Prosjektet bruker følgende teknologier:

- **React**: For å bygge brukergrensesnittet.
- **TypeScript**: For typesikkerhet.
- **Tailwind CSS** og **Chakra UI**: For rask og responsiv styling.
- **Framer Motion**: For animasjoner og overganger.
- **React Slick**: For film-karusell.
- **Axios**: For API-kall til eksterne datakilder (filmer og trailere).
- **screenfull**: For fullskjerm-modus på videoer.

## Bruk

- **Navigasjonsmenyen**: Naviger mellom forskjellige sider som "Startsiden", "Serier", og "Film".
- **HeroSection**: Se populære filmer i en slider, se trailer ved å klikke på "Watch Trailer"-knappen.
- **Trending-seksjonen**: Bla gjennom populære filmer og åpne modalen for mer informasjon om hver film.

## Videre arbeid

- Legge til brukerautentisering.
- Forbedre modalen med flere detaljer om filmene.
- Utvide med flere funksjoner som "favorittlister" og "anbefalinger".

For mer informasjon, sjekk [repoet på GitHub](https://github.com/benoah/funkyfunkpopcorn-/tree/main/src).
