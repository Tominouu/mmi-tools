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
  const path = `articles/${filename}.html`;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><title>${title}</title></head>
    <body><h1>${title}</h1><p>${date}</p><div>${content}</div></body>
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
