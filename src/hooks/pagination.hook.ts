import { useState } from 'react';
import { getPagination } from 'src/utils';

const usePagination = () => {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number[]>([]);
  const [totalSection, setTotalSection] = useState<number>(1);

  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [minPage, setMinPage] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);

  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
  }

  const onPreviousClickHandler = () => {
    // 한 페이지씩 이동
    // if (currentPage != 1) setCurrentPage(currentPage - 1);

    // 섹션 이동
    // if (currentSection != 1) setCurrentSection(currentSection - 1);

    // 한 페이지씩 이동 + 섹션 이동
    if (currentPage == 1) return;
    if (currentPage == minPage) setCurrentSection(currentSection - 1);
    setCurrentPage(currentPage - 1);
  }

  const onNextClickHandler = () => {
    // 한 페이지씩 이동
    // if (currentPage != totalPage.length) setCurrentPage(currentPage + 1);

    // 섹션 이동
    // if (currentSection != totalSection) setCurrentSection(currentSection + 1);
    
    // 한 페이지씩 이동 + 섹션 이동
    if (currentPage == totalPageCount) return;
    if (currentPage == maxPage) setCurrentSection(currentSection + 1);
    setCurrentPage(currentPage + 1);
  }

  const changeSection = (boardCount: number, countByPage : number) => {
    const { section, minPage, maxPage, totalPageCount } = getPagination(boardCount, currentSection, countByPage);
    
    setMinPage(minPage);
    setMaxPage(maxPage);
    setTotalSection(section);
    setTotalPageCount(totalPageCount);
    
    const pageList = [];
    for (let page = minPage; page <= maxPage; page++) pageList.push(page);
    setTotalPage(pageList);
  }

  return { totalPage, currentPage, currentSection, onPageClickHandler, onPreviousClickHandler, onNextClickHandler, changeSection };

}

export default usePagination;