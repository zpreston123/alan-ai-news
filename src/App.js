import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Grid, Typography, Link, Tooltip, IconButton } from '@material-ui/core';
import { Brightness2, Brightness5 } from '@material-ui/icons';
import alanBtn from '@alan-ai/alan-sdk-web';

import wordsToNumbers from 'words-to-numbers';

import NewsCards from './components/NewsCards/NewsCards';
import useStyles from './styles.js';

const alanKey = process.env.REACT_APP_API_KEY;

const App = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle, setActiveArticle] = useState(-1);
    const classes = useStyles();

    const [darkMode, setDarkMode] = useState(false);
    const theme = createTheme({
        palette: {
            type: darkMode ? 'dark' : 'light'
        }
    });

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                    setNewsArticles(articles);
                    setActiveArticle(-1);
                } else if (command === 'highlight') {
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                } else if (command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];

                    if (parsedNumber > articles.length) {
                        alanBtn().playText('Please try that again.');
                    } else if (article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...');
                    }
                }
            }
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div>
                <Grid container alignItems="flex-start" justifyContent="flex-end" direction="row">
                    <Tooltip title={darkMode ? 'Toggle light theme' : 'Toggle dark theme'}>
                        <IconButton onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? <Brightness5 /> : <Brightness2 />}
                        </IconButton>
                    </Tooltip>
                </Grid>
                <div className={classes.logoContainer}>
                    {newsArticles.length ? (
                        <div className={classes.infoContainer}>
                            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
                            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
                        </div>
                    ) : null}
                    <img src="https://alan.app/previews/preview.png" className={classes.alanLogo} alt="alan logo" />
                </div>
                <NewsCards articles={newsArticles} activeArticle={activeArticle} />
                <div className={classes.footer}>
                    <Typography variant="body1" component="h2">
                        Data fetched from <Link href="https://newsapi.org/">News API</Link>.
                    </Typography>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
