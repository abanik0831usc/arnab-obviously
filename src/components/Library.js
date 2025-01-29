"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { GrCheckbox } from "react-icons/gr";
import { ImCheckboxChecked } from "react-icons/im";

import Modal from "./Modal";

export default function Library() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef();

  const fetchItems = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: searchTerm || "",
      });

      const response = await fetch(`/api/items?${searchParams}`);
      const data = await response.json();

      if (page === 1) {
        setItems(data.items);
      } else {
        setItems((prev) => [...prev, ...data.items]);
      }

      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page, searchTerm]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]); 

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const searchValue = event.target.value.trim();
      setSearchTerm(searchValue);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setSelectedItems((prev) => {
          const newSelected = new Set(prev);
          newSelected.delete(id);
          return newSelected;
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (key === "date") {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return direction === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      const aValue = String(a[key]).toLowerCase();
      const bValue = String(b[key]).toLowerCase();

      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const handleSort = (key) => {
    const isDesc = sortConfig.key === key && sortConfig.direction === "asc";
    const direction = isDesc ? "desc" : "asc";

    const sortedItems = sortData(items, key, direction);
    setItems(sortedItems);
    setSortConfig({ key, direction });
  };

  const lastItemRef = useCallback((node) => {
    if (isLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchItems();
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, fetchItems]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="library-container">
      <Modal>
        <label className="modal-title">Library</label>
        <p>Here is a list of datasets already connected to your Obviously AI account.</p>
        <input
          type="text"
          placeholder="Search and press Enter"
          className="search-bar"
          onKeyDown={handleSearch}
        />
        <div className="items-list">
          <div className="list-header">
            <div className="column checkbox-column" onClick={handleSelectAll} style={{ cursor: "pointer" }}>
              {selectedItems.size === items.length && items.length > 0 ? (
                <ImCheckboxChecked />
              ) : (
                <GrCheckbox />
              )}
            </div>
            <div
              className="column dataset-column"
              onClick={() => handleSort("name")}
              style={{ cursor: "pointer" }}
            >
              Dataset Name {getSortIcon("name")}
            </div>
            <div
              className="column status-column"
              onClick={() => handleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Status {getSortIcon("status")}
            </div>
            <div
              className="column date-column"
              onClick={() => handleSort("date")}
              style={{ cursor: "pointer" }}
            >
              Created at {getSortIcon("date")}
            </div>
            <div
              className="column createdby-column"
              onClick={() => handleSort("createdBy")}
              style={{ cursor: "pointer" }}
            >
              Created by {getSortIcon("createdBy")}
            </div>
            <div className="column delete-column" />
          </div>
          {items.map((item, index) => {
            const isLastItem = index === items.length - 1;
            return (
              <div
                key={item.id}
                className="list-item"
                ref={isLastItem ? lastItemRef : null}
              >
                <div
                  className="column checkbox-column"
                  onClick={() => handleSelectItem(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  {selectedItems.has(item.id) ? <ImCheckboxChecked /> : <GrCheckbox />}
                </div>
                <div className="column dataset-column">
                  <div className="dataset-image-name">
                    <img
                      src={`/Icons/${item.type}.svg`}
                      alt={item.type}
                      className="file-icon"
                    />
                    <label>{item.name}</label>
                  </div>
                </div>
                <div className="column status-column">
                  <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
                <div className="column date-column">{formatDate(item.date)}</div>
                <div className="column createdby-column">{item.createdBy}</div>
                <div className="column delete-column">
                  <button onClick={() => handleDelete(item.id)}>
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="loading">Loading more items...</div>
          )}
        </div>
        <div className="next-button-container" style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="next-button">
            <p className="next-button-text">Next</p>
            <FaArrowRight display="inline" />
          </button>
        </div>
      </Modal>
    </div>
  );
}