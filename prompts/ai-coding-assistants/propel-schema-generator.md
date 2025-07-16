# Propel Schema Generator

## Generate Propel Schema Definition for Database Tables

### Prompt Description
This prompt helps generate Propel schema definitions for database tables based on feature requirements. It creates properly structured XML schema files with table definitions, columns, behaviors, and relationships while following Propel ORM conventions.

## Tags (comma-separated)
propel, schema, database, orm

### When to Use
Use this prompt when you need to create database schema definitions for new features.

### Prompt
```text
Create propel schema definition for table(tables) for the feature {FEATURE_NAME}. {FEATURE_DESCRIPTION}. {TABLE_NAME} must have {REQUIRED_FIELDS} (use {BEHAVIOR_NAME} behavior). {ENTITY_A} can have {RELATIONSHIP_TYPE} {ENTITY_B} with {RELATIONSHIP_DETAILS}. Please, do not add any additional indexes or behaviors.
```

### Example Usage
```text
Create propel schema definition for table(tables) for the feature Company Catalog. Company users see their own categories, assigned to company catalog. Catalog must have name, is_active and created/updated at (use timestampable behavior). Company can have many catalogs with assigned categories. Please, do not add any additional indexes or behaviors.
```

### Example Output
```xml
<database xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" name="zed"
    xsi:noNamespaceSchemaLocation="http://static.spryker.com/schema-01.xsd"
    namespace="Orm\Zed\CompanyCatalog\Persistence"
    package="src.Orm.Zed.CompanyCatalog.Persistence">

<table name="pyz_company_catalog" idMethod="native" allowPkInsert="true">
    <column name="id_company_catalog" required="true" type="INTEGER" autoIncrement="true" primaryKey="true"/>
    <column name="fk_company" type="INTEGER" required="true"/>
    <column name="fk_company_business_unit" type="INTEGER"/>
    <column name="name" required="true" type="VARCHAR" size="255"/>
    <column name="description" type="TEXT"/>
    <column name="is_active" type="BOOLEAN" default="true"/>
    <column name="catalog_type" required="true" size="50" type="ENUM" valueSet="default,custom,private"/>
    <column name="visibility" required="true" size="50" type="ENUM" valueSet="public,private,restricted"/>
    <column name="key" type="VARCHAR" size="255" description="Unique key for catalog identification"/>
    <column name="external_reference" type="VARCHAR" size="255"/>
    <column name="valid_from" type="TIMESTAMP"/>
    <column name="valid_to" type="TIMESTAMP"/>

    <behavior name="timestampable"/>

    <behavior name="event">
        <parameter name="pyz_company_catalog_all" column="*"/>
    </behavior>

    <foreign-key name="pyz_company_catalog-fk_company" foreignTable="spy_company" phpName="Company">
        <reference local="fk_company" foreign="id_company"/>
    </foreign-key>

    <foreign-key name="pyz_company_catalog-fk_company_business_unit"
                foreignTable="spy_company_business_unit"
                phpName="CompanyBusinessUnit">
        <reference local="fk_company_business_unit" foreign="id_company_business_unit"/>
    </foreign-key>

    <unique name="pyz_company_catalog-unique-key">
        <unique-column name="key"/>
    </unique>

    <index name="pyz_company_catalog-fk_company">
        <index-column name="fk_company"/>
    </index>

    <index name="pyz_company_catalog-fk_company_business_unit">
        <index-column name="fk_company_business_unit"/>
    </index>

</table>

</database>

### LLM
Claude 3.7 Sonnet

### AI Assistant
Windsurf

### Author
@geronica90
