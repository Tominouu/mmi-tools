const { Octokit } = require("@octokit/core");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Méthode non autorisée",
    };
  }

  const { title, content, date, filename } = JSON.parse(event.body);

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const owner = process.env.GITHUB_OWNER;
  const path = `/${filename}.html`;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><title>${title}</title><title>Article - MMI Tools</title><link rel="stylesheet" href="/styles.css"></head>
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
    <div>${content}</div>
    </body>
    </html>
  `;

  const octokit = new Octokit({ auth: token });

  try {
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      message: `Ajout automatique de l'article "${title}"`,
      content: Buffer.from(htmlTemplate).toString("base64"),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Article créé avec succès !" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Erreur : ${err.message}`,
    };
  }
};
