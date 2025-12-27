# status.jsrowe.com

Should every human have a status page? This is mine to convey a sense of permanence. If I'm not forever, maybe my README is.

## Not me James, but another

When hunting for a domain I found out that `isjamesalive.com` was already registered. Toronto? Canada? `whois` as of 2024 points to `https://www.tucows.com`. So I shifted to this `status` page concept and built it as a subdomain off `jsrowe.com`.

Hope you're still alive James of [https://www.isjamesalive.com](https://www.isjamesalive.com).

![https://www.isjamesalive.com](/isjamesalive-com-2024-06-02.png)

## How it works

This is a static site. The homepage is a grid of six public signals:

- Health
- Coding (GitHub activity)
- jsrowe.com feed
- noted.jsrowe.com feed
- Rowe Innovations
- LinkedIn

Feed data is pulled by a scheduled GitHub Action and written to `data/feeds.json`. The page reads that JSON to avoid CORS issues and keep everything static.

## Update feeds locally

```bash
npm install
npm run update-feeds
```

## Automation

GitHub Actions runs weekly and commits the refreshed `data/feeds.json`.

## Attribution

LinkedIn logo and Giphy logo from their respective brand sites

Orange ribbon awareness from the Leukemia & Lymphoma Society

heart.png ChatGPT-4o

## Sources and inspirations

- **1,000 Marbles: A Little Something About Precious Time** by Jeffrey Davis (1999) - A parable about appreciating life's finite nature by visualizing 1,000 Saturdays as marbles in a jar. [Goodreads](https://www.goodreads.com/book/show/1185555.1_000_Marbles)
- **Your Money or Your Life: 9 Steps to Transforming Your Relationship with Money and Achieving Financial Independence** by Vicki Robin and Joe Dominguez (1992) - A million-plus bestseller on changing your relationship with money. [Publisher](https://www.penguinrandomhouse.com/books/303637/your-money-or-your-life-by-vicki-robin-and-joe-dominguez-foreword-by-mr-money-mustache/)
- **Let Your Life Speak: Listening for the Voice of Vocation** by Parker J. Palmer (2000) - A Quaker-influenced reflection on finding authentic vocation by listening to your true self. [Publisher](https://books.wiley.com/titles/9780787947354/)
- **First Things First: To Live, to Love, to Learn, to Leave a Legacy** by Stephen R. Covey, A. Roger Merrill, and Rebecca R. Merrill (1994) - Time management and prioritization focused on what truly matters. [Google Books](https://books.google.com/books/about/First_Things_First.html?id=7EANAQAAMAAJ)
- **Ray Dalio's Three Phases of Life** from Principles - Dependency and learning, working with others dependent on you, and freedom to pass along what you've learned. [Free to Choose Network](https://blog.freetochoosenetwork.org/2025/08/ray-dalios-life-phases-where-are-you-in-your-arc/)
