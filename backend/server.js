const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // à définir en variable d’environnement
const REPO_OWNER = 'Tominouu';
const REPO_NAME = 'mmi-tools';
const BRANCH = 'main';

app.post('/save-article', async (req, res) => {
  try {
    const { filename, content } = req.body;

    // 1. Récupérer le SHA du fichier s'il existe (pour mise à jour)
    let sha;
    try {
      const getRes = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      sha = getRes.data.sha;
    } catch {
      // fichier n'existe pas encore, pas de SHA à récupérer
    }

    // 2. Encoder le contenu en base64
    const contentEncoded = Buffer.from(content).toString('base64');

    // 3. Créer ou mettre à jour le fichier
    await axios.put(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`, {
      message: `Ajout ou mise à jour de l'article ${filename}`,
      content: contentEncoded,
      branch: BRANCH,
      sha: sha
    }, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    res.json({ success: true, message: 'Article sauvegardé !' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Erreur lors de la sauvegarde.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend lancé sur http://localhost:${PORT}`));
