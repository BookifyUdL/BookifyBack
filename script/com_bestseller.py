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
#import pandas as pd
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


page_no = 1
file = open('com_book.csv', 'w')
#writer = csv.writer(file)
#data = ['Title', 'URL-Cover', 'Author', 'Description', 'Extension', 'Language', 'Isbn', 'Year', 'Price']
#writer.writerow(data)

#client = MongoClient("mongodb+srv://admin:U2D8PSgwPKhNdJoX@cluster0-nxv9z.mongodb.net/test?retryWrites=true&w=majority")
#db = client.test
#db.books.delete_many({})

while page_no < 3:

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
                    genreObject = {}
                    genreObject['name'] = 'Literature'
                    genreObject['picture'] = 'https://webstockreview.net/images/clipart-book-symbol-17.png'

                    authorObject = {}
                    authorObject['name'] = author


                    # resultAuthors = db.authors.find_one({'name': author})
                    # authorId = 0
                    # if resultAuthors == None:
                    #     insertResult = db.authors.insert_one(authorObject)
                    #     resultAuthors = db.authors.find_one({'name': author})
                    #     authorId = resultAuthors['_id']
                    # else:
                    #     authorId = resultAuthors['_id']

                    toinsert = {}
                    toinsert['title'] = title
                    toinsert['summary'] = description
                    toinsert['num_page'] = pageNum
                    toinsert['publication_date'] = year
                    #toinsert['author'] = authorId
                    toinsert['genre'] = {}
                    toinsert['cover_image'] = picture
                    toinsert['comments'] = {}
                    toinsert['genre'] = genreObject
                    toinsert['price'] = price
                    # _v_ = db.books.insert_one(toinsert)
                    # print _v_
                    print "Scrapping book from corte ingles"
                    corteInglesBookURl, corteInglesBookPrice = scrap_book_from_corte_ingles(title, author)
                    if corteInglesBookURl != None and corteInglesBookPrice != None:
                        print "Extraido"
                        print corteInglesBookURl
                        print corteInglesBookPrice
                    #exit(0)
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
