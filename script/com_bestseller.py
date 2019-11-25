import requests
import csv
from pymongo import MongoClient
from bs4 import BeautifulSoup

page_no = 1
file = open('com_book.csv', 'w')
writer = csv.writer(file)
data = ['Title', 'URL-Cover', 'Author', 'Description', 'Extension', 'Language', 'Isbn', 'Year', 'Price']
writer.writerow(data)
client = MongoClient("mongodb+srv://admin:admin123@cluster0-nxv9z.mongodb.net/test?retryWrites=true&w=majority")
db = client.test

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

        url = 'https://www.casadellibro.com/libros/literatura/121000000/p2' + string
        print ('Fetching data from ',url)
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        basicwrap = soup.find_all(class_='product')
        for i in basicwrap:
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
                    toinsert = {}
                    toinsert['title'] = title
                    toinsert['summary'] = description
                    toinsert['num_page'] = pageNum
                    toinsert['publication_date'] = year
                    toinsert['author'] = authorObject
                    toinsert['genre'] = {}
                    toinsert['cover_image'] = picture
                    toinsert['comments'] = {}
                    toinsert['genre'] = genreObject
                    _v_ = db.books.insert_one(toinsert)
                    print _v_
                except Exception as e:
                    pageNum = None
                    language = None
                    isbn = None
                    year = None
                    print "No funko"
                    print e
             else:
                pageNum = None
                language = None
                isbn = None
                year = None
             #data = ['Title', 'URL-Cover', 'Author', 'Description', 'Extension', 'Language', 'Isbn', 'Year', 'Price']
    except:
        break
