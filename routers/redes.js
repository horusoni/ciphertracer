import fetch from "node-fetch";
import { verificarAcesso } from "./payment.js";

export async function buscarRedesUser(req, res) {
     const userId = req.user.id
    
      const acessoValido = await verificarAcesso(userId)
      if (!acessoValido) {
   return res.json({ message: "Seu acesso expirou<br>Para renovar Menu > Planos > [Renovar Licença]", ativo: false })      }

    const { userName } = req.body;


    if (!userName) {
        return res.status(400).json({ erro: "Campo é obrigatório para buscas." });
    }

const platforms = {
  facebook: "https://www.facebook.com/" + userName,
  instagram: "https://www.instagram.com/" + userName,
  twitter: "https://twitter.com/" + userName,
  github: "https://github.com/" + userName,
  linkedin: "https://www.linkedin.com/in/" + userName,
  youtube: "https://www.youtube.com/@" + userName,
  reddit: "https://www.reddit.com/user/" + userName,
  medium: "https://medium.com/@" + userName,
  devto: "https://dev.to/" + userName,
  twitch: "https://www.twitch.tv/" + userName,
  pinterest: "https://www.pinterest.com/" + userName,
  vimeo: "https://vimeo.com/" + userName,
  soundcloud: "https://soundcloud.com/" + userName,
  spotify: "https://open.spotify.com/user/" + userName,
  telegram: "https://t.me/" + userName,
  snapchat: "https://www.snapchat.com/add/" + userName,
  patreon: "https://www.patreon.com/" + userName,
  ko_fi: "https://ko-fi.com/" + userName,
  buymeacoffee: "https://www.buymeacoffee.com/" + userName,
  steam: "https://steamcommunity.com/id/" + userName,
  origin: "https://www.origin.com/usa/en-us/profile/" + userName,
  roblox: "https://www.roblox.com/user.aspx?userName=" + userName,
  replit: "https://replit.com/@" + userName,
  itchio: "https://" + userName + ".itch.io",
  codepen: "https://codepen.io/" + userName,
  gitlab: "https://gitlab.com/" + userName,
  bitbucket: "https://bitbucket.org/" + userName,
  stackoverflow: "https://stackoverflow.com/users/" + userName,
  askfm: "https://ask.fm/" + userName,
  aboutme: "https://about.me/" + userName,
  disqus: "https://disqus.com/by/" + userName,
  lastfm: "https://www.last.fm/user/" + userName,
  bandcamp: "https://" + userName + ".bandcamp.com",
  behance: "https://www.behance.net/" + userName,
  dribbble: "https://dribbble.com/" + userName,
  artstation: "https://www.artstation.com/" + userName,
  flipboard: "https://flipboard.com/@" + userName,
  goodreads: "https://www.goodreads.com/" + userName,
  houzz: "https://www.houzz.com/user/" + userName,
  letterboxd: "https://letterboxd.com/" + userName,
  unsplash: "https://unsplash.com/@" + userName,
  mixcloud: "https://www.mixcloud.com/" + userName,
  keybase: "https://keybase.io/" + userName,
  npm: "https://www.npmjs.com/~" + userName,
  dockerhub: "https://hub.docker.com/u/" + userName,
  codeberg: "https://codeberg.org/" + userName,
  mastodon: "https://mastodon.social/@" + userName,
  kaggle: "https://www.kaggle.com/" + userName,
  deviantart: "https://www.deviantart.com/" + userName,
  flickr: "https://www.flickr.com/people/" + userName,
  imgur: "https://imgur.com/user/" + userName,
  slideshare: "https://www.slideshare.net/" + userName,
  scribd: "https://www.scribd.com/" + userName,
  academia: "https://independent.academia.edu/" + userName,
  researchgate: "https://www.researchgate.net/profile/" + userName,
  tripadvisor: "https://www.tripadvisor.com/members/" + userName,
  airbnb: "https://www.airbnb.com/users/show/" + userName,
  couchsurfing: "https://www.couchsurfing.com/people/" + userName,
  booking: "https://secure.booking.com/profile/" + userName + ".pt-br.html",
  wikidot: "https://" + userName + ".wikidot.com",
  wordpress: "https://" + userName + ".wordpress.com",
  blogger: "https://" + userName + ".blogspot.com",
  tumblr: "https://" + userName + ".tumblr.com",
  livejournal: "https://" + userName + ".livejournal.com",
  xing: "https://www.xing.com/profile/" + userName,
  vk: "https://vk.com/" + userName,
  ok: "https://ok.ru/" + userName,
  weibo: "https://weibo.com/" + userName,
  douban: "https://www.douban.com/people/" + userName,
  zhihu: "https://www.zhihu.com/people/" + userName,
  baidu: "https://tieba.baidu.com/home/main?un=" + userName,
  "500px": "https://500px.com/" + userName,
  vsco: "https://vsco.co/" + userName,
  ello: "https://ello.co/" + userName,
  mix: "https://mix.com/" + userName,
  quora: "https://www.quora.com/profile/" + userName
};

    async function checkUserExists(url) {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (OSINT-checker)"
                }
            });

            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    const resultados = {};

    for (const [platform, url] of Object.entries(platforms)) {
        const exists = await checkUserExists(url);
        resultados[platform] = exists ? url : null;
    }

    res.json({
        userName,
        resultados
    });

    console.log(userName)
    console.log(resultados)

}