import requests
import csv
import re
from pymongo import MongoClient
from bs4 import BeautifulSoup
from selenium.webdriver import Chrome
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import json
import random
#import pandas as pd
genres_list = []
casa_del_libro_id = 0
corte_ingles_id = 0
fnac_id = 0

def check_param_name(received, extracted):
    words = received.split(" ")
    for word in words:
        if word in extracted:
            return True
    return False

def scrap_book_from_fnac(title, author):
    if("(" in title):
        aux = title.split('(')[0]
    else:
        aux = title
    url = "https://www.fnac.es/SearchResult/ResultList.aspx?SCat=0%211&Search=" + aux + " " + author + "&sft=1&sa=0"
    print url
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    basicwrap = soup.find_all(class_='articleList Article-list')
    for product in basicwrap:
        bookInfo = (product.find(class_='clearfix Article-item js-Search-hashLinkId'))
        userPriceInfo = product.find(class_='userPrice')
        bookUrl = userPriceInfo['href']
        bookTitle = userPriceInfo['title']
        bookPrice = userPriceInfo.get_text().strip()

        bookInfo = (product.find(class_='Article-infoContent'))
        bookInfo = (product.find(class_='Article-descSub'))
        bookAuthor =  bookInfo.find('a').get_text()

        bookCheck = (aux.upper() in bookTitle.upper()) or (check_param_name(aux, bookTitle))
        authorCheck = (author.upper() in bookAuthor.upper()) or (check_param_name(author, bookAuthor))
        if(bookCheck or authorCheck):
            return bookUrl, price

    return None, None

def scrap_book_from_corte_ingles(title, author):
    if("(" in title):
        aux = title.split('(')[0]
    else:
        aux = title
    url = "https://www.elcorteingles.es/libros/search/?s=" + aux + " " + author
    #print url
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    basicwrap = soup.find_all(class_='product-list 4')
    for product in basicwrap:
        content = product.findAll('li')
        for book in content:
            bookInfo = (book.find(class_='dataholder js-dataholder-product'))
            bookInfoJson = json.loads(bookInfo['data-json'])
            price = bookInfoJson["price"]["final"]
            bookInfo = (book.find(class_='info'))
            bookName = (bookInfo.find(class_='info-name').get_text().strip())
            bookUrl = "elcorteingles.es" + (bookInfo.find(class_='info-name').find('a')['href'])
            authorName = (bookInfo.find(class_='brand c12').get_text().strip())
            bookCheck = (aux.upper() in bookName.upper()) or (check_param_name(aux, bookName))
            authorCheck = (author.upper() in authorName.upper()) or (check_param_name(author, authorName))
            if(bookCheck or authorCheck):
                return bookUrl, price
    return None, None

def add_genre_by_name(genre):
    resultGenres = db.genres.find_one({'name': genre['name']})
    genreId = 0
    if resultGenres == None:
        insertResult = db.genres.insert_one(genre)
        resultGenres = db.genres.find_one({'name': genre['name']})
        genreId = insertResult.inserted_id
    else:
        genreId = resultGenres['_id']
    genres_list.append(genreId)

def add_genres(db):
    db.genres.delete_many({})
    genre1 = {}
    genre1['name'] = 'Biography'
    genre1['picture'] = 'genre1'
    add_genre_by_name(genre1)

    genre2 = {}
    genre2['name'] = 'Computing / Interenet'
    genre2['picture'] = 'genre2'
    add_genre_by_name(genre2)

    genre3 = {}
    genre3['name'] = 'Crime'
    genre3['picture'] = 'genre3'
    add_genre_by_name(genre3)

    genre4 = {}
    genre4['name'] = 'Education'
    genre4['picture'] = 'genre4'
    add_genre_by_name(genre4)

    genre5 = {}
    genre5['name'] = 'Literature'
    genre5['picture'] = 'genre5'
    add_genre_by_name(genre5)

    genre6 = {}
    genre6['name'] = 'Health'
    genre6['picture'] = 'genre6'
    add_genre_by_name(genre6)

    genre7 = {}
    genre7['name'] = 'Romance'
    genre7['picture'] = 'genre7'
    add_genre_by_name(genre7)

    genre8 = {}
    genre8['name'] = 'Fantasy'
    genre8['picture'] = 'genre8'
    add_genre_by_name(genre8)

    genre9 = {}
    genre9['name'] = 'Adventure'
    genre9['picture'] = 'genre9'
    add_genre_by_name(genre9)

def add_shops(db):
    db.shops.delete_many({})
    shop1 = {}
    shop1['name'] = 'Casa del Libro'
    shop1['url'] = 'https://www.cuponeto.com/wp-content/uploads/2019/01/casa-del-libro-descuentos.png'
    resultGenres = db.shops.find_one({'name': shop1['name']})
    if resultGenres == None:
        insertResult = db.shops.insert_one(shop1)
        resultGenres = db.shops.find_one({'name': shop1['name']})
        casa_del_libro_id = resultGenres['_id']
    else:
        casa_del_libro_id = resultGenres['_id']


    shop2 = {}
    shop2['name'] = 'El Corte Ingles'
    shop2['url'] = 'https://www.elcorteingles.es/recursos/informacioncorporativa/img/portal/2017/07/06/el-corte-ingles-triangulo.png'
    resultGenres2 = db.shops.find_one({'name': shop2['name']})
    if resultGenres2 == None:
        insertResult = db.shops.insert_one(shop2)
        resultGenres = db.shops.find_one({'name': shop2['name']})
        corte_ingles_id = resultGenres['_id']
    else:
        corte_ingles_id = resultGenres2['_id']


    shop3 = {}
    shop3['name'] = 'Fnac'
    shop3['url'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Fnac_Logo.svg/499px-Fnac_Logo.svg.png'
    resultGenres3 = db.shops.find_one({'name': shop3['name']})
    if resultGenres3 == None:
        insertResult = db.shops.insert_one(shop3)
        resultGenres = db.shops.find_one({'name': shop1['name']})
        fnac_id = resultGenres['_id']
    else:
        fnac_id = resultGenres3['_id']

    return casa_del_libro_id, corte_ingles_id, fnac_id

page_no = 1
first_books = 0
file = open('com_book.csv', 'w')

client = MongoClient("mongodb+srv://admin:U2D8PSgwPKhNdJoX@cluster0-nxv9z.mongodb.net/test?retryWrites=true&w=majority")
db = client.test
db.books.delete_many({})
db.items.delete_many({})
db.shops.delete_many({})

add_genres(db)
casa_del_libro_id, corte_ingles_id, fnac_id = add_shops(db)

while page_no < 3:
    genres_index = 0
    try:
        if page_no == 1:
            string = ''
            #https://www.amazon.com/best-sellers-books-Amazon/zgbs/books/ref=zg_bs_pg_2?_encoding=UTF8&pg=2
            #https://www.amazon.com/best-sellers-books-Amazon/zgbs/books/ref=zg_bs_pg_2?_encoding=UTF8&pg=
        else:
            #string = 'ref=zg_bs_pg_2?_encoding=UTF8&pg=2'+str(page_no)
            string = 'p' + str(page_no)
        page_no += 1

        url = 'https://www.casadellibro.com/libros/literatura/121000000/' + string
        print ('Fetching data from ',url)
        # response = requests.get(url)
        # soup = BeautifulSoup(response.content, 'html.parser')
        # basicwrap = soup.find_all(class_='product')

        #selenium part

        driver = webdriver.Firefox()
        driver.get(url)
        productsAux = driver.find_elements_by_class_name("results-page")
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        basicwrap = soup.find_all(class_='product')
        for i in basicwrap:
             try:
                 priceZone = (i.find(class_="price").get_text().strip())
                 utf8string = priceZone.encode("utf-8")
                 aux = utf8string.split(" ")[0]
                 price = ""
                 for c in aux:
                     if c.isdigit() or c == ".":
                         price += c
             except:
                price =  None
             try:
                 bookUrl = (i.find(class_='title'))
                 bookUrl = bookUrl['href']
             except:
                 bookUrl = None
             try:
                 title = (i.find(class_='title').get_text().strip())
             except:
                 title = None
             try:
                 author = (i.find(class_='author').get_text().strip())
             except:
                 author = None
             try:
                 description = (i.find(class_='description').get_text().strip())
             except:
                 description  = None
             try:
                 picture = (i.find(class_='product-img product-img--book'))
                 picture = picture.img['data-src']
             except:
                 picture = None

             if bookUrl != None:
                currentBookUrl = 'https://www.casadellibro.com' + bookUrl
                bookResponse = requests.get(currentBookUrl)
                soup = BeautifulSoup(bookResponse.content, 'html.parser')

                #En el shopping bag sale el precio despues de apretar aadir cesta
                #priceInner = soup.find(class_='shopping-bag')
                #print priceInner

                extraInfo = soup.find(class_='dataproduct__info')
                rightside = (extraInfo.find(class_='right_side'))
                try:
                    productParameters = (rightside.find(class_='product_parameters')).findAll('p')
                    pageNum = productParameters[0].findAll('span')[1].get_text().strip()
                    language = productParameters[2].findAll('span')[1].get_text().strip()
                    isbn = productParameters[4].findAll('span')[1].get_text().strip()
                    year = productParameters[5].findAll('span')[1].get_text().strip()
                    data = [title, picture, author, description, pageNum, language, isbn, year, 0.00]


                    #print data
                    #genreObject = {}
                    #genreObject['name'] = 'Literature'
                    #genreObject['picture'] = 'https://webstockreview.net/images/clipart-book-symbol-17.png'


                    authorObject = {}
                    authorObject['name'] = author


                    resultAuthors = db.authors.find_one({'name': author})
                    authorId = 0
                    if resultAuthors == None:
                        insertResult = db.authors.insert_one(authorObject)
                        resultAuthors = db.authors.find_one({'name': author})
                        authorId = resultAuthors['_id']
                    else:
                        authorId = resultAuthors['_id']

                    toinsert = {}
                    toinsert['title'] = title
                    toinsert['summary'] = description
                    toinsert['num_page'] = pageNum
                    toinsert['publication_date'] = year
                    #toinsert['author'] = authorId
                    toinsert['genre'] = {}
                    toinsert['cover_image'] = picture
                    toinsert['comments'] = []
                    #toinsert['genre'] = genreObject
                    auxi = genres_index % (len(genres_list) - 1)
                    print auxi
                    print genres_list[auxi]
                    toinsert['genre'] = genres_list[auxi]
                    toinsert['rating'] = random.randint(1, 5)
                    toinsert['num_rating'] = 1
                    if(first_books < 10):
                        toinsert['is_new'] = True
                        first_books += 1
                    else:
                        toinsert['is_new'] = False

                    genres_index += 1
                    #toinsert['price'] = price
                    _v_ = db.books.insert_one(toinsert)
                    resultVerga = db.books.find_one({'title': title})
                    bookId = resultVerga['_id']

                    #inset item as casa del libro
                    cdl = {}
                    cdl['shop_id'] = casa_del_libro_id
                    cdl['book_id'] = bookId
                    cdl['price'] = float(price)
                    cdl['url'] = currentBookUrl
                    db.items.insert_one(cdl)


                    print "Scrapping book from corte ingles"
                    corteInglesBookURl, corteInglesBookPrice = scrap_book_from_corte_ingles(title, author)
                    if corteInglesBookURl != None and corteInglesBookPrice != None:
                        cdl = {}
                        cdl['shop_id'] = corte_ingles_id
                        cdl['book_id'] = bookId
                        cdl['price'] = float(corteInglesBookPrice)
                        cdl['url'] = corteInglesBookURl
                        db.items.insert_one(cdl)

                    print "Scrapping book from fnac"
                    fnacBookURl, fnacBookPrice = scrap_book_from_fnac(title, author)
                    if fnacBookURl != None and fnacBookURl != None:
                        cdl = {}
                        cdl['shop_id'] = fnac_id
                        cdl['book_id'] = bookId
                        cdl['price'] = float(fnacBookPrice)
                        cdl['url'] = fnacBookURl
                        db.items.insert_one(cdl)

                    print "Todo correcto"                
                except Exception as e:
                    pageNum = None
                    language = None
                    isbn = None
                    year = None
                    #driver.quit()
                    print "No funciono correctamente"
                    print e
             else:
                pageNum = None
                language = None
                isbn = None
                year = None
                #driver.quit()
             #data = ['Title', 'URL-Cover', 'Author', 'Description', 'Extension', 'Language', 'Isbn', 'Year', 'Price']
             #driver.quit()
    except:
        break
