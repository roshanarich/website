//connect pages to node.js and to run through terminal
const express = require('express');
const app = express();
const port = 5056;
const path = require('path');

app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.static('content'));
app.use('/articles', express.static(path.join(__dirname, 'content/articles')));
app.use('/books', express.static(path.join(__dirname, 'content/books')));
app.use('/reports', express.static(path.join(__dirname, 'content/reports')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connection to mongodb to acces the articles 
const mongoose = require("mongoose");
const { type } = require('os');
var uri = "mongodb://127.0.0.1:27017/finalproject-test";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;

//connecting all pages

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});
const user = {
    firstName: 'Roshana',
    lastName: 'Richards',
}
app.get('/', (req, res) => {
    res.render('index',{
        user: user
  })
})
app.get('/shop', (req, res) => {
    res.render('shop',{
        discover: articles
 })
})
app.get('/order', (req, res) => {
  res.render('order',{
      discover: articles
})
})
app.get('/privacy', (req, res) => {
  res.render('privacy',{
      discover: articles
})
})
app.get('/discover', (req, res) => {
  res.render('discover',{
      discover: articles
})
})
app.get('/submitform', (req, res) => {
  res.render('submitform',{
      discover: articles
})
})
app.get('/faq', (req, res) => {
  res.render('faq',{
      discover: articles
})
})
app.get('/aboutus', (req, res) => {
  res.render('aboutus',{
      discover: articles
})
})
app.get('/ourservices', (req, res) => {
  res.render('ourservices',{
      discover: articles
})
})
app.get('/shipping', (req, res) => {
  res.render('shipping',{
      discover: articles
})
})
app.get('/confirm', (req, res) => {
  res.render('confirm',{
      discover: articles
})
})
app.get('/returns', (req, res) => {
  res.render('returns',{
      discover: articles
})
})
app.get('/myprofile', (req, res) => {
  res.render('myprofile',{
      discover: articles
})
})
app.get('/shopbooks', (req, res) => {
  res.render('shopbooks',{
      discover: articles
})
})
app.get('/shopreports', (req, res) => {
  res.render('shopreports',{
      discover: articles
})
})
app.get('/shoparticles', (req, res) => {
  res.render('shoparticles',{
      discover: articles
})
})
app.listen(port, () => {
  console.log(`Now listening on port ${port}`)
});

//connecting the search bar to the mongobd database
const Article = mongoose.model('articles', { 
  Title: String, 
  Authors: Array, 
  Year: Number,
  Abstract: String,
  Keywords: Array,
  File: String,
  Type: String,
});
app.get('/', function(req, res) {
  res.render('index', { message: '', results: [] });
});
app.get('/search', async function(req, res) {
  const keywords = req.query.query != null ? req.query.query : "";
  const words = keywords.split(" ");
  //const text_fields = ["Keywords", "Title", "Authors", "Abstract", "Type"];
  try {
//improved query option 
let query = Article.find();
if (keywords != "") {
const or_conditions = [];
words.forEach(word => {
or_conditions.push({"Keywords": {$regex: word, $options: 'i'}},
        
  { Keywords: { $regex: word, $options: 'i' } },
  { Title: { $regex: word, $options: 'i' } },
  { Authors: { $regex: word, $options: 'i' } },
  { Abstract: { $regex: word, $options: 'i' } },
  { Keywords: { $regex: word, $options: 'i' } },
  { Type: { $regex: word, $options: 'i' } },)

if (!isNaN(word))
  or_conditions.push({"Year": parseInt(word)});
});    
console.log("conditions", or_conditions);
  query = Article.find().or(or_conditions);
} 
const sort = req.query.sort;
const content_type = req.query.content_type;

if (content_type === "article") {
  query = query.find({ "Type": "Article" })
} else if (content_type === "report") {
  query = query.find({ "Type": "Report" })
} else if (content_type === "book") {
  query = query.find({ "Type": "Book" })
}
//search bar to search by authors 
//query.find(Authors: {$regex: name})
//query.find( Authors: { $regex: word} ),

if (sort === "year-asc") {
  query = query.sort({ Year: 1 });
} else  {
  query = query.sort({ Year: -1 });
} 

const results = await query;
console.log(results);
if (results.length === 0) {
  res.render('search', { message: "No results found"});
} else {
  res.render('search', { results: results, sort: sort });
}
} catch (err) {
console.error(err);
if (err.name === 'CastError') {
  res.status(400).render('search', { message: "Invalid query parameter"});
} else if (err.name === 'DocumentNotFoundError') {
  res.render('search', { message: "No results found"});
} else {
  res.status(500).render('search', { message: "Error occurred while searching" });
}
}
});
    
//old query option 
    //const results = await Article.find({
     // $or: [
      //  { Keywords: { $regex: query, $options: 'i' } },
       // { Title: { $regex: query, $options: 'i' } },
        //{ Authors: { $regex: query, $options: 'i' } },
        //{ Abstract: { $regex: query, $options: 'i' } },
        //{ Keywords: { $regex: query, $options: 'i' } },
        //{ Type: { $regex: query, $options: 'i' } },
        //{ Year: parseInt(query) },
      //].filter(Boolean),
    //});

    
const articles = [
  {
  "_id": "6423c365a079dd2da9fc2785",
  "Title": "A Century Of Criminal Law and Criminology: Foreword",
  "Authors": [
  "Amy DeLine",
  "Adair Crosley"
  ],
  "Year": 2010,
  "Abstract": "When the First National Conference on Criminal Law and Criminology drew to a close, its delegates resolved to establish the first English-language periodical devoted to the scientific study of the criminal law and criminology. Only months later? and exactly one century ago? the seminal pages of The Journal of Criminal Law and Criminology (Journal) were published. This, the hundredth volume of the Journal, is committed to honoring the Journals history and, more generally, the past one hundred years of criminal law and criminology.",
  "Keywords": [
  "CRIMINAL",
  "LAW ",
  "Amy",
  "DeLine",
  "Adair",
  "Crosley",
  "CRIMINOLOGY"
  ],
  "File": "articles/1-AmyDeLine.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc2786",
  "Title": "Broken Windows and Zero Tolerance: Policing Urban Crimes",
  "Authors": [
  "C. R. Sridhar"
  ],
  "Year": 2006,
  "Abstract": "This article discusses some controversial aspects of the theory of broken windows and its application to the strategy to the zero tolerance in the policing of urban crimes. The strategy was first adopted by the New York police department during the tenure of Republican mayor Rudy Giuliani and has been strongly recommended for the policing of crime in other cities in the world.",
  "Keywords": [
  "Policing",
  "C.",
  "R.",
  "Sridhar",
  "Urban",
  "Crime"
  ],
  "File": "articles/2-C.R.Sridhar.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc2788",
  "Title": "Crime and Crime Control",
  "Authors": [
  "Hee-Jong Joo"
  ],
  "Year": 2003,
  "Abstract": "This article provides an overall picture of crime and crime control in Korea over the past 30 years. By using official crime data, we examined general trends and characteristics of crime, crime rates, and crime control practices in each stage of the criminal justice system in Korea during that period. The relative seriousness of crime problems in Korea is also examined from a comparative perspective by engaging in a cross-national comparison. The findings of this research indicate that the overall crime problem in Korea is not as serious as that in Japan and in the United States. Recent data, however, show an alarming increase in the crime rates in Korea during the past several years. These results are interpreted within a social context, and we can determine that economic, political, and socio-cultural factors have played and continue to play a crucial role in crime and crime control practices. Recent phenomena, such as the financial crisis that hit Korea in the late 1990s, and the current political stalemate in Korea, seem to have contributed to the disturbing increase in crime and crime rates.",
  "Keywords": [
  "CRIME",
  "CRIME",
  "Hee-Jong",
  "Joo",
  "CONTROL"
  ],
  "File": "articles/3-Hee-JongJoo.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc2789",
  "Title": "Cultural Studies and the Sociology of Culture",
  "Authors": [
  "Janet Wolff"
  ],
  "Year": 1999,
  "Abstract": "Ten years ago, I moved from Britain to the United States. Before that date, I had taught for 13 years in a department of sociology in Britain. My geographical move also entailed an apparent change of disciplines (and, given the nature of the academy in Britain and the United States, also a change of academic divisions, from the social sciences to the humanities). But the change was only apparent, except in the material sense of my institutional location. My work didn't change radically (though I hope it has developed in the past decade). I didn't retrain, or take another Ph.D. This biographical fact is interesting, I think, not for its own sake, but because of what it says about the organization of disciplines in Britain and America, and about the study of culture in the late twentieth century.",
  "Keywords": [
  "Cultural",
  "Studies",
  "Sociology",
  "Janet",
  "Wolff",
  "Culture"
  ],
  "File": "articles/4-JanetWolff.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc278a",
  "Title": "Youth, Crime, and Cultural Space",
  "Authors": [
  "Jeff Ferrell"
  ],
  "Year": 1997,
  "Abstract": "In the contemporary arrangements of youth, cultural and criminal processes collapse one into the other. Young people construct subcultural styles and practices that evolve in contradictory, overlapping spirals of contested meaning: as moments of self-identification and political resistance, as street-hip commodities appropriated for marketing to mass audiences, and as dangerous antecedents to and symbols of criminality. Media factories, political machines, and legal bureaucracies draw on these styles and practices to produce images of youthful crime and victimization, which in turn shape the actions and perceptions of criminal justice practitioners, criminals, victims-to-be, and other media consumers. Right-wing zealots and other publicity hustlers launch media? ated attacks on the popular culture echoes of youthful style rap songs, music videos, cartoons, and hip hop films for their alleged promotion of delinquent behavior, and these media campaigns spin off still other distorted afterimages and amplified (mis)understandings of crime and delinquency. Television programmers mine the aggressive dynamic of street-level police work against inner-city kids and other populations to assemble repetitive and profitable \"reality television\" programming, and in so doing transform this work into the unreality of an endlessly staged morality play. Time and again, a culture saturated by the image and reality of youthful crime projects its meaning out onto particular individuals and events, and back onto itself.",
  "Keywords": [
  "Youth",
  "Crime",
  "Jeff",
  "Ferrell",
  "Cultural Space"
  ],
  "File": "articles/5-JeffFerrell.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc278b",
  "Title": "Feminism and Criminology in Britain",
  "Authors": [
  "Loraine Gelsthorpe",
  "Allison Morris"
  ],
  "Year": 1988,
  "Abstract": "The academic manifestation of feminism is a recent developme feminist work within criminology in Britain probably dates frocation of Carol Smarts book Women, Crime and Criminology in 1 Heidensohn (1977, 390) described its publication as a turnin claimed that the issues raised by Smart were now very firmly for all criminologists (1977, 392). Others were more sceptical. This review of Smart's book (1977, 393), doubted that analyst been inflicted on criminological theories by not considering wom he acknowledged that potential value of feminism: a feminist soc indeed be potent ifit could indicate how much formal constructio modified to incorporate the female (1977,393) and ifit criminal be proved to be analytically inadequate then a feminist criminol be intellectually momentous (1977,394). Just over ten years lat appropriate to explore the extent to which these challenges have impact which feminism has had on mainstream debates in crimi the significance of feminism for criminology. Consideration of however, demands first that we refer in brief to the development and its impact on other academic",
  "Keywords": [
  "FEMINISM",
  "CRIMINOLOGY",
  "Loraine",
  "Gelsthorpe",
  "Allison",
  "Morris",
  "BRITAIN"
  ],
  "File": "articles/6-LoraineGelsthorpe.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc278c",
  "Title": "Inequality and Crime ",
  "Authors": [
  "Morgan Kelly"
  ],
  "Year": 2000,
  "Abstract": "This paper considers the relationship between inequality and crime using data from urban counties. The behavior of property and violent crime are quite different. Inequality has no effect on property crime but a strong and robust impact on violent crime, with an elasticity above 0.5. By contrast, poverty and police activity have significant effects on property crime, but little on violent crime. Property crime is well explained by the economic theory of crime, while violent crime is better explained by strain and social disorganization theories. ",
  "Keywords": [
  "INEQUALITY",
  "Morgan",
  "Kelly",
  "CRIME"
  ],
  "File": "articles/7-MorganKelly.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc278d",
  "Title": "Varieties of Enlightenment Criminology: Beccaria, Godwin, De Sade",
  "Authors": [
  "Philip Jenkins"
  ],
  "Year": 1984,
  "Abstract": "This article aims at a fundamental reassessment of the nature and complexity of Classical criminology, and of the radical pioneering usually assigned to Cesare Beccaria (1738-94). It will here be pro that Beccaria was a deeply conservative figure who sought to create a criminological system which evaded the dangerously revolutionary and materialist implications of Enlightenment thought. Whatever his to intentions, the result of his work was the creation of a bureaucratic tool. That a thoroughly revolutionary criminology was possible at this t shown by the extensive writing of the anarchist William Go (1756-1836) and the libertine atheist the Marquis de Sade (1740-1814).",
  "Keywords": [
  "VARIETIES",
  "ENLIGHTENMENT",
  "Philip",
  "Jenkins",
  "CRIMINOLOGY"
  ],
  "File": "articles/8-PhilipJenkins.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc278e",
  "Title": "Social Policy, and Family Policy: Concepts, Concerns, and Analytic Tools",
  "Authors": [
  "Shirley L. Zimmerman"
  ],
  "Year": 1979,
  "Abstract": "Although the concept of family policy is ill defined, ambiguous, and emotionally laden, many are advocating efforts to examine the impact of public policies on families. This paper seeks to examine family policy and family impact analysis to concepts such as policy, in general, policy analysis, social policy analysis, and social impact assessment. It is an attempt to arrive at definitional clarity with respect to each, and thereby contribute to the developing conceptualisation of family policy and family impact analysis. The paper concludes by suggesting that family impact analysis may be able to facilitate goal consensus regarding family policy, and thereby contribute to its formulation, If such formulation is indeed desirable.",
  "Keywords": [
  "Policy",
  "Social Policy",
  "Family",
  "Concepts",
  "Concerns",
  "Shirley",
  "L.",
  "Zimmerman",
  "Analytic Tools"
  ],
  "File": "articles/9-ShirleyL.Zimmerman.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc278f",
  "Title": "States and Social Policies",
  "Authors": [
  "Theda Skocpol",
  "Edwin Amenta"
  ],
  "Year": 1986,
  "Abstract": "Comparative social scientists have developed various arguments about the determinants of social policies, especially those connected with twentieth- century \"welfare states.\" Structure-functionalists argue that the social policies of modern nations necessarily converge due to an underlying logic of industrial- ism, while neo-Marxists treat such policies as state responses to the social reproduction requirements of advanced capitalism. Yet most students of social policies are more attuned to history and politics. Concentrating on two dozen or fewer industrial capitalist democracies, many scholars have explored the alternative ways in which democratic political processes have helped to create programs and expand social expenditures. For a fuller range of nations past and present, scholars have also asked how ties to the world-economy, patterns of geopolitical competition, and processes of transnational cultural modelling have influenced social policies. Finally, there is now considerable interest in the independent impact of states on social policymaking. States may be sites of autonomous official initiatives, and their institutional structures may help to shape the political processes from which social policies emerge. In turn, social policies, once enacted and implemented, themselves transform politics. Con- sequently, the study over time of \"policy feedbacks\" has become one of the most fruitful current areas of research on states and social policies.",
  "Keywords": [
  "STATES",
  "SOCIAL",
  "POLICIES",
  "Theda",
  "Skocpol",
  "Edwin",
  "Amenta",
  "Policy"
  ],
  "File": "articles/10-ThedaSkocpol.pdf",
  "Type": "Article"
  },
  {
  "_id": "6423c365a079dd2da9fc2790",
  "Title": "Knowledge, Policy and Practice in Education and the Struggle for Social Justice ",
  "Authors": [
  "Bob Lingard"
  ],
  "Year": 2020,
  "Abstract": "As Geoff Whitty himself acknowledged, as director of the Institute of Education (IOE) (2000–10) he was pulled to some extent away from his disciplinary focus of the sociology of education towards more policy issues, pragmatically in his work as director and also in his research work. Yet he continued to argue the significance of the sociology of education: for understanding the contexts of education policy and for creating more socially just schools and schooling systems, and in the mission of the IOE to teachers and to the broader fields of education, as both a domain of research and of practice. His books Making Sense of Policy (Whitty 2002) and Research and Policy in Education (Whitty 2016) sit firmly within what has been called ‘policy sociology in education’ (Ozga 1987). It is Geoff Whitty’s work in this domain that will be the focus of this chapter.",
  "Keywords": [
  "Policy",
  "Sociology",
  "Geoff Whitty",
  "Education",
  "Research",
  "Social",
  "Bob",
  "Lingard",
  "Justice"
  ],
  "File": "books/11-BobLingard.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2791",
  "Title": "How Ideology Shaped Psychology in Times of Wars and after Wars",
  "Authors": [
  "Gordana Jovanović"
  ],
  "Year": 2019,
  "Abstract": "The main aim of this chapter, seen within the general framework of the re- lationship of politics and psychology, is to reconstruct prevailing ideological underpinnings of developments in psychology in the twentieth century. Given the fact that the twentieth century was substantially determined by two world wars and the Cold War, special attention will be given to the influence of war ideologies on psychology as discipline and profession. As far as the history of psychology is concerned, a socio-genetic approach will be assumed, meaning that the emergence of psychology and its subdisciplines is understood as a re- sponse to the needs of modern society organized on new assumptions. From such a perspective, psychology is seen as playing an important role in modern ideological projects.",
  "Keywords": [
  "Ideology",
  "Shaped",
  "Psychology",
  "Time",
  "Wars",
  "Gordana",
  "Jovanović",
  "Politics"
  ],
  "File": "books/12-GordanaJovanović.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2792",
  "Title": "Poverty Alleviation",
  "Authors": [
  "Brian Van Arkadie",
  "Raymond Mallon"
  ],
  "Year": 2003,
  "Abstract": "As well as the ‘growing out of poverty’ and ‘liberalisation as a poverty reduction strategy’, the initial conditions inherited from the pre-reform period were important determinants of the general poverty alleviation program. This chapter indicates that the performance of the Vietnamese economy – in the past decade – in relation to alleviation of poverty has been exemplary, although the alleviation of poverty happened despite the lack of an explicit poverty alleviation strategy or program. In terms of growth and poverty alleviation, market reforms were a key input into the acceleration of agricultural growth, much of it based on the household farm, which has been a critical factor in reducing rural poverty. However, while poverty has been reduced, the rate of income improvements among the poor is slower than the average rate. The challenge is how to prevent such inequalities from being consolidated and from becoming the basis of an entrenched class society.",
  "Keywords": [
  "POVERTY",
  "ALLEVIATION",
  "ethnic",
  "groups",
  "food poverty line",
  "Living Standards Measurement Surveys",
  "poverty line",
  "poverty",
  "reduction",
  "social development",
  "Brian",
  "Van",
  "Arkadie",
  "Raymond",
  "Mallon",
  "welfare"
  ],
  "File": "books/13-BrianVanArkadie.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2793",
  "Title": "Prevention, Criminology and Governmentality Reconsidered",
  "Authors": [
  "Christine Gervais"
  ],
  "Year": 2010,
  "Abstract": "In recognition of alleged crises, fragmentations and failures in crimi- nology, some criminologists have reflected retrospectively and intro- spectively on the state and potential of our discipline (see, for example, among others, Braithwaite 1989 and 2000; Chan 2000; Cohen 1988; Ericson and Carriere 1994; Foucault 1980; Garland 1992; Garland and Sparks 2000; Martel et al. 2006; Nelken 1994; O’Malley 2000; Pasquino 1991; Pavarini 1994; Pavlich 2000; and South 1997). Such critical and reflexive endeavours often raise concerns about the theo- retical direction and practical worth of criminology. In many of these cogitations, some colleagues have both exposed and opposed criminol- ogy’s institutional, managerial, applied and administrative orientations as problematically complicit, insular, hegemonic, controversial and partisan (see, for example, Chunn and Menzies 2006; Hogeveen and Woolford 2006; and Williams and Lippert 2006). While such musings have tended towards purging and pessimism, they have also drawn our collective attention, rather optimistically, towards worthwhile alterna- tives to which we may aspire, and in which we may engage.",
  "Keywords": [
  "Prevention",
  "Criminology",
  "Christine",
  "Gervais",
  "Governmentality"
  ],
  "File": "books/14-ChristineGervais.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2794",
  "Title": "The Historical Origins of Community Policing in 19th Century Britain and Imperial Japan",
  "Authors": [
  "Deniz Kocak"
  ],
  "Year": 2018,
  "Abstract": "This chapter addresses the frequently cited historical origins of the contemporary community policing paradigm. The British metropolitan policing by Sir Robert Peel as well as the Japanese koban policing are regarded as the main sources of community policing in theoretical as well as in practical terms for contemporary community-based approaches to policing.119 Moreover, the Peelian police reform and the consequential British metropolitan policing are regarded as the foundation for modern policing. The paper explicitly takes the respective country context and its normative objectives of police reform into account. Therefore, discussing the British Metropolitan policing and the Imperial Japanese koban policing does not intend to equate these political entities with each other. Due to the significance of the Metropolitan policing approach in modern policing, the Metropolitan policing approach serves as the main reference point for the subsequent variances of community policing approaches. While the Peelian police reform will be presented in the first part of this section, the second part takes a closer look at the Japanese koban and its development since the late 19th century in Japan. Finally, the last part of this chapter reflects on the creation and development of koban policing in light of the theoretical framework. The chapter illustrates, and this is particularly true for the koban approach, that closely linked police-citizen relations and cooperation enabled the police to establish a comprehensive and complex surveillance system to uphold state security.",
  "Keywords": [
  "Community",
  "Policing",
  "19th",
  "Century",
  "Britain",
  "Imperial Japan",
  "Rethinking",
  "International",
  "Police",
  "Deniz",
  "Kocak",
  "Reform"
  ],
  "File": "books/15-DenizKocak.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2795",
  "Title": "Inequality, Poverty, and Social Policy in Mexico",
  "Authors": [
  "Emma Aguila",
  "Alisher R. Akhmedjonov",
  "Ricardo Basurto-Davila",
  "Krishna B. Kumar",
  "Sarah Kups",
  "Howard J. Shatz"
  ],
  "Year": 2012,
  "Abstract": "In this chapter, we analyze the challenges Mexico faces in the social sector. This is a topic worthy of U.S. concern because economic reforms that promote growth but fail to reduce poverty, inequality, and regional disparities will not succeed in achieving sustainable economic growth and the objectives of these reforms, such as potentially reducing migration. Therefore, programs and policies that improve the well-being of the population need to be put in place in parallel with other structural reforms.",
  "Keywords": [
  "Inequality",
  "Poverty",
  "Social",
  "Policy",
  "Emma",
  "Aguila",
  "Alisher",
  "R.",
  "Akhmedjonov",
  "Ricardo",
  "Basurto-Davila",
  "Krishna",
  "B.",
  "Kumar",
  "Sarah",
  "Kups",
  "Howard",
  "J.",
  "Shatz",
  "Mexico"
  ],
  "File": "books/16-EmmaAguila.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2796",
  "Title": "The Criminology of Corruption",
  "Authors": [
  "Gjalt de Graaf",
  "Patrick von Maravić",
  "Pieter Wagenaar"
  ],
  "Year": 2010,
  "Abstract": "Corruption is a form of crime. Most people, including scholars, would agree on that. Criminology is a scientific discipline that has crime as its object of study. Surprisingly, however, corruption has rarely been the focus of crimi- nological research and mostly in the context of broader concepts of crime, such as organized crime. This is rather strange because other concepts are perfectly suitable for a criminological analysis of corruption. As criminolo- gists, we are convinced of the added value of a criminological perspective on corruption. Taking criminology as the reference point we will address two is- sues in this chapter.",
  "Keywords": [
  "Criminology",
  "Gjalt",
  "de",
  "Graaf",
  "Patrick",
  "von",
  "Maravić",
  "Pieter",
  "Wagenaar",
  "Corruption"
  ],
  "File": "books/17-GjaltdeGraaf.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2797",
  "Title": "Pathways and processes towards a gender equality policy",
  "Authors": [
  "Meredith Edwards",
  "Miranda Stewart"
  ],
  "Year": 2017,
  "Abstract": "All aspects of government action and policy have gender implications. The federal Office for Women has identified three areas of focus for Australian Government policy on gender: (1) women’s safety from violence; (2) representation of women, for example on decision-making boards and in politics; and (3) economic empowerment. This volume presents new and important research about gender inequality in Australia’s tax-transfer (welfare) system, including theoretical, empirical and policy analysis of this theme. The research in this volume aligns in particular with the goal of women’s economic empowerment, which is highlighted by the Office for Women as ‘an economic and social priority. It’s good for women and their families, their communities, business and the nation’s economy’ (Office for Women 2016). The Minister for Women, Senator Michaelia Cash, has emphasised policies to support women at the G20 (Cash 2014) and, in particular for parenting and domestic violence, in a statement accompanying the 2017–18 Budget (Cash 2017). However, gender impact remains marginalised in Australia’s budget. The most recent Budget Papers (Treasury 2017) do not contain any gender impact analysis of policy. This is in stark contrast to the recent Canadian budget (Government of Canada 2017).",
  "Keywords": [
  "gender",
  "equality",
  "Meredith",
  "Edwards",
  "Miranda",
  "Stewart",
  "policy"
  ],
  "File": "books/18-MeredithEdwards.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2798",
  "Title": "Police Legitimacy",
  "Authors": [
  "Robert E. Worden",
  "Sarah J. McLean"
  ],
  "Year": 2017,
  "Abstract": "Police legitimacy—that is, public trust in and a felt obligation to obey the police—forms the fulcrum of the procedural justice model of policing. Such outlooks are intrinsically important, of course, and they are important also be- cause research suggests that they lead to other valued outcomes: compliance with the law, providing information to police, working with them on commu- nity problems, and accepting police directions and decisions in police-citizen encounters. Tom Tyler’s model of process-based regulation (Tyler 1988, 1990, 2003, 2004; Tyler, Goff, and MacCoun, 2015) holds that trust is influenced by the procedural justice with which authorities are perceived to wield their powers, and so it would appear to be susceptible to enhancement through improvements in the procedural justice with which police act.",
  "Keywords": [
  "Police",
  "Legitimacy",
  "Robert",
  "E.",
  "Worden",
  "Sarah",
  "J.",
  "McLean",
  "Reform"
  ],
  "File": "books/19-RobertE.Worden.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc2799",
  "Title": "Teaching applied psychology at the University of Adelaide: A personal view",
  "Authors": [
  "Neil Kirby"
  ],
  "Year": 2016,
  "Abstract": "In 1974 the introduction of the Diploma in Applied Psychology marked a major change in the teaching and research within the then Department (now School) of Psychology at the University of Adelaide. Prior to that time, the Department of Psychology had been almost entirely experimental in its approach to psychology, exemplifying the 'rats and stats' tag given by students to the subject. The 'stats' tag was to endure to the present time, but 'rats' ended in 1996 with the phasing out of practicals using rats in 'Skinner boxes', which had been organised for many years by Frank Dalziel to demonstrate operant conditioning principles.",
  "Keywords": [
  "History",
  "Psychology",
  "Schools",
  "Adelaide",
  "Neil",
  "Kirby",
  "Universities"
  ],
  "File": "books/20-NeilKirby.pdf",
  "Type": "Book"
  },
  {
  "_id": "6423c365a079dd2da9fc279a",
  "Title": "Human psychology and intelligent machines",
  "Authors": [
  "Aaron Celaya",
  "Nick Yeung"
  ],
  "Year": 2019,
  "Abstract": "The cheaper artificial intelligence (AI) and its related technologies become, the more they will become pervasive: they will be employed outside of the domains for which they were initially conceived. As the previous chapters have illustrated, automation will take over more mundane and repetitive tasks, thus making the role of human beings, paradoxically, more important in the decision process. As a result, the benefits of artificial intelligence will depend, critically, on the interaction between humans and machines, first, and on their acceptance. These two topics have little to do with the technology and much to do with the psychology of human beings. Machines can be, in theory, perfectly designed, but they will be of little utility if users have pratical biases in using or trusting them. Similarly, it will be difficult to benefit from intelligent machines if they are not accepted – not an unlikely outcome if we look at the historical record. This chapter provides an introduction to the literature on the psychology of the interaction between human beings and machines, illustrating what aspects practitioners will have to consider – at the tactical, operational and strategic levels.",
  "Keywords": [
  "Human",
  "psychology",
  "intelligent",
  "machines",
  "Aaron",
  "Celaya",
  "Nick",
  "Yeung"
  ],
  "File": "reports/21-AaronCelaya.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc279b",
  "Title": "Social Policy",
  "Authors": [
  "Arbara Kotschwar"
  ],
  "Year": 2014,
  "Abstract": "One of the principal driving trends in the global economy is the dramatic rise of the middle class in the developing world. Both Latin America and Africa have seen a significant portion of their population move from poverty into the middle class. The African Development Bank estimates that the middle class in Africa has tripled in the past 30 years. Latin America’s middle class has famously grown by 50 percent over the past decade, and now represents 30 percent of the population, according to the World Bank.",
  "Keywords": [
  "Social",
  "Arbara",
  "Kotschwar",
  "Policy"
  ],
  "File": "reports/23-BarbaraKotschwar.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc279c",
  "Title": "Police Corruption: What Past Scandals Teach about Current Challenges ",
  "Authors": [
  "David Bayley",
  "Robert Perito"
  ],
  "Year": 2011,
  "Abstract": "Police corruption is a universal problem, but it is a particular challenge in countries in crisis and emerging from conflict. This report is based on the lessons gleaned from a review of public commissions of inquiry into police misconduct worldwide and their possible application in stability operations, such as those in Iraq and Afghanistan. The study attempts to determine whether past scandals can help us deal more effectively with the contemporary problems of nation building and police reform.",
  "Keywords": [
  "Police",
  "Corruption",
  "Past",
  "Scandals",
  "David",
  "Bayley",
  "Robert",
  "Perito",
  "Challenges"
  ],
  "File": "reports/24-DavidBayley.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc279d",
  "Title": "Youth Probation In The Time Of Covid-19",
  "Authors": [
  "Emily Mooney",
  "Nila Bala"
  ],
  "Year": 2020,
  "Abstract": "Termed the “workhorse of the juvenile justice sys- tem,” probation is the result of more than half of youth delinquency cases. And, as government and correctional leaders have reduced incarcerated pop- ulations to curb the spread of the deadly COVID-19 pan- demic, its importance within the youth justice system has only grown. Such a development is hardly surprising, as the close-quarters living conditions associated with continued incarceration has disastrous effects: As of June 24, 2020, 658 youth and 771 staff in juvenile facilities had tested positive for COVID-19.",
  "Keywords": [
  "YOUTH",
  "PROBATION",
  "TIME",
  "Emily",
  "Mooney",
  "Nila",
  "Bala",
  "COVID-19"
  ],
  "File": "reports/25-EmilyMooney.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc279e",
  "Title": "The impact of COVID-19 on cyber crime and state-sponsored cyber activities ",
  "Authors": [
  "Johannes Wiggen"
  ],
  "Year": 2020,
  "Abstract": "In March 2020, governments worldwide imposed curfews and rules on reducing physical social contact in order to stem the spread of the corona virus. Wherever possible, employers allowed their employees to work from home, where, more and more, private IT devices are being used for official business. This larger IT surface is often less well protected than IT devices used at work. New programs, e.g. for conference calls and video conferences, are being introduced under time pressure, in most cases without adequate security checks. Also, there are more and more reports about cyber attacks on health-care organizations on whose proper function- ing governments and societies are more dependent now than ever. What is the impact of the COVID-19 pandemic on cyber security, cyber crime and state-sponsored cyber activities? How can governments reduce cyber threats and address them?",
  "Keywords": [
  "COVID-19",
  "crime",
  "state-sponsored",
  "Johannes",
  "Wiggen",
  "cyber"
  ],
  "File": "reports/26-JohannesWiggen.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc279f",
  "Title": "Social Policy Responses to the COVID-19 Crisis and the Road Ahead",
  "Authors": [
  "Merike Blofield",
  "Bert Hoffmann"
  ],
  "Year": 2020,
  "Abstract": "Aside from the health challenge, the COVID-19 pandemic has brought an unprecedented social crisis to Latin America and the Caribbean (LAC). To avoid a humanitarian disaster, governments across the region have re-sponded with a marked expansion of social protection measures. These, however, vary greatly with regard to speed, breadth, and sufficiency.",
  "Keywords": [
  "Social",
  "Policy",
  "Responses",
  "COVID-19",
  "Merike",
  "Blofield",
  "Bert",
  "Hoffmann",
  "Crisis"
  ],
  "File": "reports/27-MerikeBlofield.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc27a0",
  "Title": "Theories of crime and violence",
  "Authors": [
  "Robert Muggah",
  "Katherine Aguirre Tobón"
  ],
  "Year": 2018,
  "Abstract": "Many types of crime are widely under-reported in Latin America because citizens simply do not trust the police. Yet victimization surveys consistently demonstrate a much higher rate of crime than is reported by national statistics offices. For example, in Peru – the official incidence of robbery is 217 events per 100,000 or 64,000 incidents. Victimization surveys suggest that 23% of Peruvians were robbed or 6.8 million potential incidents. These gaps between administrative data and reported victimization are consistent across virtually all countries of Latin America.",
  "Keywords": [
  "Theories",
  "crime",
  "Robert Muggah",
  "Katherine",
  "Aguirre",
  "Tobón",
  "violence"
  ],
  "File": "reports/28-RobertMuggah.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc27a1",
  "Title": "International political sociology, or:: The social ontology and power politics of process",
  "Authors": [
  "Stefano Guzzini"
  ],
  "Year": 2016,
  "Abstract": "International Relations has been going through repeated ebbs and flows. The emergence of international political sociology as a research field can be seen in this context. It started in the 1980s in response to Kenneth Waltz’s Theory of International Politics. Although Waltz’s neorealism may look like a mere foil, an easy target that allowed more social and political theory into International Relations (IR), it was not (e.g. Ashley, 1986 [1984]; Walker, 1987; Wendt, 1987). For the context was one where IR had started to move beyond the “diplomatic- strategic chessboard” (Aron, 1962), emancipating itself from its own historio- graphy of the first two debates and the resulting implicit matrix according to which IR theory was to be understood. A now largely forgotten Third Debate of ‘Globalism versus Realism’ (already sanitised in Maghroori and Ramberg, 1982), which acknowledged the rise of Latin American Marxist and dependency theorists (e.g. Cardoso, 1973; Cardoso and Faletto, 1979; Dos Santos, 1970; Frank, 1966; O'Donnell, 1973), as well as of early International Political Economy (e.g. Cox, 1981; Gilpin, 1975; Strange, 1970, 1971; Vernon, 1971), had provoked an identity crisis in IR, which was unable to define, or rather, contain, its core and boundaries. The acceptance of Waltz as the core the reference by the main discipline, for defenders and detractors alike, put an end to that crisis. It defined an exceedingly narrow field of IR – purely systemic analysis of inter-state politics – and anchored its theoretical underpinnings in a form of utilitarianism: states as value- maximising agents facing each other in a strategic game of cooperation or conflict under anarchy (Guzzini, 1998: chapters 8–9). Waltz and the debate which ensued channelled the mainstream back into well-known waters, as in the neo–neo debate (Wæver, 1996), and thus stemmed the 1970s’ scholarly explorations of new terrains. Although perhaps even unfair to Waltz, his book came to epitomise that closure. International political sociology stems from a response to this, and then later attempts at closure.",
  "Keywords": [
  "International",
  "political",
  "sociology",
  "social",
  "ontology",
  "power",
  "Stefano",
  "Guzzini",
  "politics"
  ],
  "File": "reports/29-StefanoGuzzini.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc27a2",
  "Title": "Criminological Perspectives on Female Suicide Terrorism",
  "Authors": [
  "Maria Alvanou"
  ],
  "Year": 2006,
  "Abstract": "Following the terrorist strikes that shook the United States on September 11, 2001, the phenomenon of suicide attacks became a topic of particular interest to terrorism analysts, psychologists, government officials, and much of the general public in various regions of the world. Special attention has turned to the use of women as suicide attackers, as it appears to be a broadening trend among Chechen and Palestinian groups.",
  "Keywords": [
  "Criminological",
  "Perspectives",
  "Female",
  "Suicide",
  "Maria",
  "Alvanou",
  "Terrorism"
  ],
  "File": "reports/30-MariaAlvanou.pdf",
  "Type": "Report"
  },
  {
  "_id": "6423c365a079dd2da9fc27a3",
  "Title": "Urbanisation, rural–urban migration and urban poverty",
  "Authors": [
  "Cecilia Tacoli",
  "Gordon McGranahan",
  "David Satterthwaite"
  ],
  "Year": 2015,
  "Abstract": "Urural-urban migration continues to attract much interest, but also growing concern. Migrants are often blamed for increasing urban poverty, but not all migrants are poor. In many cities, however, migrants form a large proportion of the urban poor with whom they share income and non-income disadvantages, including difficulties in finding adequate housing and in accessing services. Like the majority of the urban poor, they work long hours in low-paid, insecure and unsafe jobs and are exposed to a wide range of environmental hazards because most low-income and informal settlements lack basic infrastructure. In many cases when urban governments try to reduce or control rural–urban migration, this also affects low-income residents and not just migrants.",
  "Keywords": [
  "Urbanisation",
  "rural–urban",
  "migration",
  "urban",
  "Cecilia",
  "Tacoli",
  "Gordon",
  "McGranahan",
  "David",
  "Satterthwaite",
  "poverty"
  ],
  "File": "reports/31-CeciliaTacoli.pdf",
  "Type": "Report"
  }
  ]
  
  //attempt to connect the auto suggestions for the search bar to the keywords field from mongodb
 
 //src="https://code.jquery.com/jquery-3.6.0.min.js"
 //src="path/to/jquery.min.js"
// src="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"
//  src="https://code.jquery.com/jquery-1.12.4.js"
 //src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"
  //src="https://code.jquery.com/jquery-3.6.0.min.js"
  //src="path/to/jquery.min.js"
 //;
  //const keywords = [];
  //articles.forEach((article) => {
    //article.Keywords.forEach((keyword) => {
      //if (!keywords.includes(keyword)) {
        //keywords.push(keyword);
      //}
    //});
  //});
  //$(function() {
    //$("#searchInput").autocomplete({
      //source: keywords
    //});
  //});