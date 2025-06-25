const { Octokit } = require("@octokit/core");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Méthode non autorisée",
    };
  }

  const {
    title,
    content,
    date,
    category,
    readingTime,
    filename,
    featuredImage,
    images = [],
  } = JSON.parse(event.body);

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const owner = process.env.GITHUB_OWNER;

  const octokit = new Octokit({ auth: token });

  // 1. Upload des images dans assets/img/
  for (const image of images) {
    const imagePath = `assets/img/${image.name}`;

    try {
      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: imagePath,
        message: `Ajout image "${image.name}" pour l'article "${title}"`,
        content: image.content,
      });
    } catch (err) {
      return {
        statusCode: 500,
        body: `Erreur lors de l'upload de l'image ${image.name} : ${err.message}`,
      };
    }
  }

  // 2. Génération de la page HTML
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - MMI Tools</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <header class="header">
        <nav class="nav">
          <a href="index.html" class="logo">MMI Tools</a>
          <ul class="nav-links">
            <li><a href="dev-web.html">Développement Web</a></li>
            <li><a href="design.html">Design</a></li>
            <li><a href="audiovisuel.html">Audiovisuel</a></li>
          </ul>
          <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </header>

      <main>
        <article class="article-page">
          <div class="article-header">
            <div class="article-info">
              <h1>${title}</h1>
              <div class="article-meta">
                <span><i class="far fa-calendar"></i> ${date}</span>
                <span><i class="far fa-folder"></i> ${category || "Non classé"}</span>
                <span><i class="far fa-clock"></i> ${readingTime || '5 min de lecture'}</span>
              </div>
            </div>
          </div>

          <div class="article-content-full">
            ${content}
          </div>

          <div class="article-navigation">
            <a href="#" class="prev-article disabled">← Article précédent</a>
            <span class="next-article disabled">Article suivant →</span>
          </div>
        </article>
      </main>

      <footer class="footer">
        <p>© 2025 MMI Tools. Tous droits réservés.</p>
      </footer>

      <script src="/app.js"></script>
    </body>
    </html>
  `;

  // 3. Upload de l'article HTML
  try {
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path: `${filename}.html`,
      message: `Ajout automatique de l'article "${title}"`,
      content: Buffer.from(htmlTemplate).toString("base64"),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Article et images publiés avec succès !" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Erreur lors de la création de l'article : ${err.message}`,
    };
  }
};
